# DescriptionPro - Shopify Product Description Optimizer

An AI-powered tool that optimizes your Shopify product descriptions to reduce token costs while maintaining quality and SEO performance.

## Features

- 🤖 AI-powered description optimization using Claude
- 📊 Real-time dashboard with savings metrics
- 🔗 Direct Shopify integration
- ⚡ Bulk optimization for multiple products
- 🎯 Configurable optimization aggressiveness levels

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   - Copy `.env.example` to `.env.local`
   - Add your Anthropic API key: `ANTHROPIC_API_KEY=your_key_here`

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000) in your browser**

## API Endpoints

- `POST /api/optimize` - Optimize a single product description
- `POST /api/optimize-bulk` - Optimize multiple products
- `POST /api/shopify/sync` - Sync and optimize products from Shopify

## Deployment

This app is configured for Vercel deployment. Make sure to set the environment variables in your Vercel dashboard.

## Usage

1. Connect your Shopify store on the homepage
2. View optimization metrics on the dashboard
3. Configure optimization settings
4. Run bulk optimization on your products

## Technologies

- Next.js 14
- React 18
- Anthropic Claude API
- Recharts for data visualization
- Tailwind CSS for styling