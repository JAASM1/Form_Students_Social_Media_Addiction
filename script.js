const SUPABASE_URL = "https://zkwxrsnestixtrivrmef.supabase.co";
const SUPABASE_APIKEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inprd3hyc25lc3RpeHRyaXZybWVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4MjU3NTUsImV4cCI6MjA2NjQwMTc1NX0.YUW16DrIDpZzsOKf7aZU5NYP7hadC1FPFU65lD9D-KI";

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_APIKEY);

// Cargar países desde el JSON
async function loadCountries() {
  try {
    const response = await fetch('./data/country.json');
    const data = await response.json();
    const countrySelect = document.getElementById('Country');
    
    data.countries.forEach(country => {
      const option = document.createElement('option');
      option.value = country;
      option.textContent = country;
      countrySelect.appendChild(option);
    });
  } catch (error) {
    console.error('Error al cargar países:', error);
  }
}

// Cargar países cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', loadCountries);

// Actualizar valores de los rangesliders
const ageSlider = document.getElementById("Age");
const ageValue = document.getElementById("ageValue");
ageSlider.addEventListener("input", () => {
  ageValue.textContent = `${ageSlider.value} años`;
});

const usageSlider = document.getElementById("Avg_Daily_Usage_Hours");
const usageValue = document.getElementById("usageValue");
usageSlider.addEventListener("input", () => {
  usageValue.textContent = `${parseFloat(usageSlider.value).toFixed(1)} horas`;
});

const sleepSlider = document.getElementById("Sleep_Hours_Per_Night");
const sleepValue = document.getElementById("sleepValue");
sleepSlider.addEventListener("input", () => {
  sleepValue.textContent = `${parseFloat(sleepSlider.value).toFixed(1)} horas`;
});

const mentalSlider = document.getElementById("Mental_Health_Score");
const mentalValue = document.getElementById("mentalValue");
mentalSlider.addEventListener("input", () => {
  mentalValue.textContent = `${mentalSlider.value}/10`;
});

// Función para mostrar alertas personalizadas
function showAlert(type, title, message) {
  // Remover alertas existentes
  const existingAlerts = document.querySelectorAll(".custom-alert");
  existingAlerts.forEach((alert) => alert.remove());

  const alert = document.createElement("div");
  alert.className = `custom-alert ${type}`;

  const icon = type === "success" ? "✅" : "❌";

  alert.innerHTML = `
                <div class="alert-icon">${icon}</div>
                <div class="alert-content">
                    <div class="alert-title">${title}</div>
                    <div class="alert-message">${message}</div>
                </div>
                <button class="alert-close" onclick="this.parentElement.remove()">×</button>
            `;

  document.body.appendChild(alert);

  // Mostrar con animación
  setTimeout(() => alert.classList.add("show"), 100);

  // Auto-remover después de 5 segundos
  setTimeout(() => {
    if (alert.parentElement) {
      alert.classList.remove("show");
      setTimeout(() => alert.remove(), 400);
    }
  }, 5000);
}

// Manejo del formulario
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formulario");
  const submitBtn = form.querySelector(".submit-btn");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Agregar estado de carga
    submitBtn.classList.add("loading");
    submitBtn.textContent = "Enviando...";

    try {
      const formData = new FormData(form);
      const data = {
        Age: parseInt(formData.get("Age")),
        Gender: formData.get("Gender"),
        Academic_Level: formData.get("Academic_Level"),
        Country: formData.get("Country"),
        Avg_Daily_Usage_Hours: parseFloat(
          formData.get("Avg_Daily_Usage_Hours")
        ),
        Most_Used_Platform: formData.get("Most_Used_Platform"),
        Sleep_Hours_Per_Night: parseFloat(
          formData.get("Sleep_Hours_Per_Night")
        ),
        Mental_Health_Score: parseInt(formData.get("Mental_Health_Score")),
        Relationship_Status: formData.get("Relationship_Status"),
      };

      const { error } = await supabaseClient
        .from("Students_Social_Media_Addiction")
        .insert([data]);

      if (error) {
        console.error("Error detallado:", error);
        showAlert(
          "error",
          "Error al enviar",
          `No se pudieron guardar los datos: ${
            error.message || "Error desconocido"
          }`
        );
      } else {
        showAlert(
          "success",
          "¡Enviado exitosamente!",
          "Tus datos han sido guardados correctamente en la base de datos."
        );

        form.reset();
        // Restablecer valores de los sliders
        ageSlider.value = 20;
        usageSlider.value = 3;
        sleepSlider.value = 7;
        mentalSlider.value = 5;
        ageValue.textContent = "20 años";
        usageValue.textContent = "3.0 horas";
        sleepValue.textContent = "7.0 horas";
        mentalValue.textContent = "5/10";
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      showAlert(
        "error",
        "Error de conexión",
        "No se pudo conectar con el servidor. Verifica tu conexión a internet."
      );
    } finally {
      // Remover estado de carga
      submitBtn.classList.remove("loading");
      submitBtn.textContent = "ENVIAR";
    }
  });
});
