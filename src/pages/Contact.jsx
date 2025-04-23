export default function Contact() {
    return (
      <section className="contact-section">
        <h1>Contáctanos</h1>
        <p>
          ¿Tienes alguna pregunta o quieres hacer un pedido personalizado? ¡Estamos aquí para ayudarte! Contáctanos a través de WhatsApp y te responderemos lo antes posible.
        </p>
        <div className="contact-info">
          <h3>Nuestros números:</h3>
          <ul>
            <li>
              <a href="https://wa.me/51987654321" target="_blank" rel="noopener noreferrer">
                +51 922 746 146
              </a>
            </li>
            <li>
              <a href="https://wa.me/51912345678" target="_blank" rel="noopener noreferrer">
                +51 927 319 124
              </a>
            </li>
          </ul>
        </div>
      </section>
    );
  }