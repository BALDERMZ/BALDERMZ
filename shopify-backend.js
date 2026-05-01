// DescriptionPro - Backend para Shopify App
// Deploy en Vercel

const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ============================================
// 1. OPTIMIZACIÓN ESPECÍFICA PARA E-COMMERCE
// ============================================

async function optimizeProductDescription(
  description,
  productType = "general",
  aggressiveness = "balanced"
) {
  if (!description || description.trim().length === 0) {
    return {
      error: "Descripción no puede estar vacía",
      status: 400,
    };
  }

  try {
    // Prompt específico para e-commerce
    const systemPrompt = getEcommercePrompt(productType, aggressiveness);

    const message = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 800,
      messages: [
        {
          role: "user",
          content: `${systemPrompt}

DESCRIPCIÓN ORIGINAL:
"${description}"

RESPONDE EN FORMATO:

OPTIMIZADA:
[descripción corta pero efectiva]

TOKENS GUARDADOS:
[número]

CALIDAD SCORE:
[0-100]

CAMBIOS:
[listado de cambios realizados]`,
        },
      ],
    });

    const responseText = message.content[0].text;

    // Parsear respuesta
    const optimizedMatch = responseText.match(
      /OPTIMIZADA:\n([\s\S]*?)(?=\n\nTOKENS|$)/
    );
    const tokensMatch = responseText.match(/TOKENS GUARDADOS:\n(\d+)/);
    const qualityMatch = responseText.match(/CALIDAD SCORE:\n(\d+)/);
    const changesMatch = responseText.match(/CAMBIOS:\n([\s\S]*?)$/);

    const optimized = optimizedMatch ? optimizedMatch[1].trim() : description;
    const tokensSaved = tokensMatch ? parseInt(tokensMatch[1]) : 0;
    const qualityScore = qualityMatch ? parseInt(qualityMatch[1]) : 85;
    const changes = changesMatch ? changesMatch[1].trim() : "";

    const originalTokens = estimateTokens(description);
    const optimizedTokens = estimateTokens(optimized);
    const actualSavings = originalTokens - optimizedTokens;

    return {
      status: 200,
      success: true,
      data: {
        original: {
          text: description,
          tokens: originalTokens,
          length: description.length,
        },
        optimized: {
          text: optimized,
          tokens: optimizedTokens,
          length: optimized.length,
        },
        savings: {
          tokens: Math.max(actualSavings, tokensSaved),
          percentage: Math.round(
            ((Math.max(actualSavings, tokensSaved) / originalTokens) * 100)
          ),
          estimatedCost: (
            Math.max(actualSavings, tokensSaved) * 0.00003
          ).toFixed(4),
        },
        quality: {
          score: qualityScore,
          verdict: qualityScore >= 85 ? "SAFE" : "REVIEW",
        },
        changes: changes,
        metadata: {
          productType,
          aggressiveness,
          timestamp: new Date().toISOString(),
        },
      },
    };
  } catch (error) {
    return {
      status: 500,
      error: error.message,
      success: false,
    };
  }
}

// ============================================
// 2. BULK OPTIMIZATION (para Shopify)
// ============================================

async function optimizeProductsFromShopify(products, options = {}) {
  const results = [];
  const stats = {
    total: products.length,
    success: 0,
    failed: 0,
    totalTokensSaved: 0,
    totalCostSaved: 0,
  };

  for (const product of products) {
    try {
      const result = await optimizeProductDescription(
        product.description,
        product.type || "general",
        options.aggressiveness || "balanced"
      );

      if (result.success) {
        results.push({
          productId: product.id,
          productName: product.name,
          ...result.data,
        });

        stats.success++;
        stats.totalTokensSaved += result.data.savings.tokens;
        stats.totalCostSaved += parseFloat(result.data.savings.estimatedCost);
      } else {
        stats.failed++;
      }
    } catch (error) {
      stats.failed++;
      results.push({
        productId: product.id,
        error: error.message,
      });
    }

    // Rate limiting: 1 segundo entre requests
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return {
    status: 200,
    success: true,
    results,
    stats,
  };
}

// ============================================
// 3. SHOPIFY API INTEGRATION
// ============================================

async function getShopifyProducts(shopId, accessToken, limit = 250) {
  try {
    const response = await fetch(
      `https://${shopId}.myshopify.com/admin/api/2024-01/products.json?limit=${limit}`,
      {
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    return data.products.map((p) => ({
      id: p.id,
      name: p.title,
      description: p.body_html || "",
      type: p.product_type,
    }));
  } catch (error) {
    throw new Error(`Error fetching Shopify products: ${error.message}`);
  }
}

async function updateShopifyProduct(
  shopId,
  accessToken,
  productId,
  optimizedDescription
) {
  try {
    const response = await fetch(
      `https://${shopId}.myshopify.com/admin/api/2024-01/products/${productId}.json`,
      {
        method: "PUT",
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product: {
            body_html: optimizedDescription,
          },
        }),
      }
    );

    return response.ok;
  } catch (error) {
    throw new Error(`Error updating Shopify product: ${error.message}`);
  }
}

// ============================================
// 4. WEBHOOKS & API ENDPOINTS
// ============================================

// Para Vercel
module.exports = async (req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Routes
  if (req.path === "/api/optimize" && req.method === "POST") {
    return optimizeRoute(req, res);
  } else if (req.path === "/api/optimize-bulk" && req.method === "POST") {
    return optimizeBulkRoute(req, res);
  } else if (req.path === "/api/shopify/sync" && req.method === "POST") {
    return shopifySyncRoute(req, res);
  } else {
    return res.status(404).json({ error: "Ruta no encontrada" });
  }
};

async function optimizeRoute(req, res) {
  const { description, productType = "general", aggressiveness = "balanced" } =
    req.body;

  const result = await optimizeProductDescription(
    description,
    productType,
    aggressiveness
  );

  res.status(result.status).json(result);
}

async function optimizeBulkRoute(req, res) {
  const { products, aggressiveness = "balanced" } = req.body;

  if (!Array.isArray(products) || products.length === 0) {
    return res
      .status(400)
      .json({ error: "Se requiere array de productos" });
  }

  const result = await optimizeProductsFromShopify(products, {
    aggressiveness,
  });

  res.status(result.status).json(result);
}

async function shopifySyncRoute(req, res) {
  const { shopId, accessToken, autoUpdate = false } = req.body;

  if (!shopId || !accessToken) {
    return res
      .status(400)
      .json({
        error: "Se requieren shopId y accessToken",
      });
  }

  try {
    // 1. Obtener productos
    const products = await getShopifyProducts(shopId, accessToken);

    // 2. Optimizar
    const optimized = await optimizeProductsFromShopify(products);

    // 3. Si autoUpdate, actualizar en Shopify
    if (autoUpdate) {
      for (const result of optimized.results) {
        if (result.optimized && result.optimized.text) {
          await updateShopifyProduct(
            shopId,
            accessToken,
            result.productId,
            result.optimized.text
          );
        }
      }
    }

    res.status(200).json({
      success: true,
      ...optimized,
      autoUpdateApplied: autoUpdate,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
}

// ============================================
// 5. HELPERS
// ============================================

function estimateTokens(text) {
  return Math.ceil(text.length / 4);
}

function getEcommercePrompt(productType, aggressiveness) {
  const aggressivenessMap = {
    conservative: "máximo 20% de reducción",
    balanced: "30-40% de reducción",
    aggressive: "50%+ de reducción",
  };

  const typeGuides = {
    clothing: `
      - Mantén: talla, material, color, estilo
      - Elimina: verbosidad sobre calidad/durabilidad
      - Prioriza: ajuste, composición`,
    electronics: `
      - Mantén: especificaciones técnicas clave
      - Elimina: descripciones largas de características
      - Prioriza: compatibilidad, garantía`,
    furniture: `
      - Mantén: dimensiones, material, estilo
      - Elimina: descripciones poéticas
      - Prioriza: montaje, cuidado`,
    general: `
      - Mantén: características principales
      - Elimina: descripciones redundantes
      - Prioriza: beneficio al usuario`,
  };

  return `Eres un experto en optimización de descripciones de productos para e-commerce.

Tu tarea:
- Reduce texto MANTENIENDO la información crítica
- Objetivo: ${aggressivenessMap[aggressiveness] || aggressivenessMap.balanced}
- Mejora SEO/conversion rate
- ${typeGuides[productType] || typeGuides.general}

Restricciones:
- NUNCA sacrifiques clarity
- Mantén el tono profesional
- Asegura que sigue siendo atractivo para el cliente`;
}

// Exports
exports.optimizeProductDescription = optimizeProductDescription;
exports.optimizeProductsFromShopify = optimizeProductsFromShopify;
exports.getShopifyProducts = getShopifyProducts;
exports.updateShopifyProduct = updateShopifyProduct;
