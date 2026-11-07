const form = document.querySelector("#opinion-form");
const nameInput = document.querySelector("#reader-name");
const opinionInput = document.querySelector("#reader-opinion");
const opinionsList = document.querySelector("#opinions-list");
const countElement = document.querySelector("#opinion-count");
const charCount = document.querySelector("#char-count");
const feedback = document.querySelector("#form-feedback");
const menuToggle = document.querySelector("#menu-toggle");
const nav = document.querySelector("#nav");

const STORAGE_KEY = "karaiba-opinioes-v1";

function getOpinions() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (error) {
    console.error("Não foi possível ler as opiniões salvas:", error);
    return [];
  }
}

function saveOpinions(opinions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(opinions));
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(dateString));
}

function renderOpinions() {
  const opinions = getOpinions();
  countElement.textContent = opinions.length;

  if (opinions.length === 0) {
    opinionsList.innerHTML = `
      <div class="empty-state">
        <span>✧</span>
        <strong>O mural está esperando por você.</strong>
        <p>As opiniões enviadas aparecerão aqui neste navegador.</p>
      </div>`;
    return;
  }

  opinionsList.replaceChildren();
  opinions.forEach((opinion) => {
    const card = document.createElement("article");
    card.className = "opinion-card";

    const header = document.createElement("div");
    header.className = "opinion-card-head";

    const author = document.createElement("strong");
    author.textContent = opinion.name;

    const date = document.createElement("time");
    date.dateTime = opinion.date;
    date.textContent = formatDate(opinion.date);

    const message = document.createElement("p");
    message.textContent = opinion.message;

    header.append(author, date);
    card.append(header, message);
    opinionsList.append(card);
  });
}

opinionInput.addEventListener("input", () => {
  charCount.textContent = opinionInput.value.length;
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = nameInput.value.trim();
  const message = opinionInput.value.trim();

  if (!name || !message) {
    feedback.textContent = "Preencha seu nome e sua opinião antes de publicar.";
    return;
  }

  const opinions = getOpinions();
  opinions.unshift({
    name: name.slice(0, 40),
    message: message.slice(0, 500),
    date: new Date().toISOString()
  });

  try {
    saveOpinions(opinions);
    renderOpinions();
    form.reset();
    charCount.textContent = "0";
    feedback.textContent = "Sua opinião foi publicada neste navegador. Obrigado por participar!";
  } catch (error) {
    feedback.textContent = "Não foi possível salvar agora. Verifique o armazenamento do navegador.";
    console.error(error);
  }
});

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
  menuToggle.textContent = isOpen ? "×" : "☰";
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
    menuToggle.textContent = "☰";
  });
});

renderOpinions();
