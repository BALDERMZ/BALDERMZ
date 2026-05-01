export default function Home() {
  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Arial' }}>
      <h1>✅ DescriptionPro está online!</h1>
      <p>Tu app funciona correctamente en Vercel.</p>
      
      <hr style={{ margin: '30px 0' }} />
      
      <h2>Instala DescriptionPro en tu Shopify</h2>
      
      <p>
        <input
          type="text"
          placeholder="Ejemplo: mi-tienda.myshopify.com"
          id="shopInput"
          style={{
            padding: '10px',
            width: '300px',
            fontSize: '16px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
      </p>
      
      <p>
        <button
          onClick={() => {
            const shop = document.getElementById('shopInput').value;
            if (shop) {
              window.location.href = `/api/auth/authorize?shop=${shop}`;
            } else {
              alert('Por favor escribe el nombre de tu tienda');
            }
          }}
          style={{
            padding: '12px 30px',
            backgroundColor: '#008000',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          Conectar Tienda
        </button>
      </p>
      
      <p>
        <button
          onClick={() => {
            window.location.href = '/dashboard';
          }}
          style={{
            padding: '12px 30px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            marginLeft: '10px'
          }}
        >
          Ver Dashboard Demo
        </button>
      </p>

      <hr style={{ margin: '30px 0' }} />
      
      <p style={{ color: '#666' }}>
        ¿Necesitas ayuda? Contacta a support@descriptionpro.com
      </p>
    </div>
  );
}
