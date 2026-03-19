import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from "./context/AuthContext.tsx";
import './css/index.css'
import App from './page/App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
)
// Déclare les variables globales avec des types explicites
let draggedCard: HTMLElement | null = null;
let placeholder: HTMLDivElement | null = null;
let dragSourceColumn: HTMLElement | null = null;

// Fonction pour ouvrir une modale avec des informations
export function openModal(title: string, description: string, dueDate: string): void {
  (document.getElementById("modal-title") as HTMLElement).textContent = title;
  (document.getElementById("modal-description") as HTMLElement).textContent = `Description : ${description}`;
  (document.getElementById("modal-due-date") as HTMLElement).textContent = `Date limite : ${dueDate}`;
  (document.getElementById("modal") as HTMLElement).style.display = "block";
}

// Fonction pour fermer la modale
export function closeModal(): void {
  (document.getElementById("modal") as HTMLElement).style.display = "none";
}

// Gestion du clic en dehors de la modale pour la fermer
globalThis.onclick = function(event: MouseEvent): void {
  const modal = document.getElementById("modal");
  if (event.target === modal) {
    modal!.style.display = "none";
  }
};

// Initialisation des écouteurs d'événements pour les colonnes de cartes
document.querySelectorAll<HTMLElement>(".cards").forEach((cardsContainer) => {
  cardsContainer.addEventListener("dragover", dragOver);
  cardsContainer.addEventListener("dragleave", dragLeave);
  cardsContainer.addEventListener("drop", drop);
});

// Début du drag
export function dragStart(e: DragEvent): void {
  if (placeholder) {
    placeholder.parentNode!.removeChild(placeholder);
    placeholder = null;
  }

  draggedCard = (e.target as HTMLElement).closest(".card") as HTMLElement;
  dragSourceColumn = draggedCard.parentNode as HTMLElement;
  e.dataTransfer!.effectAllowed = "move";
  e.dataTransfer!.setData("text/plain", "");
  draggedCard.style.opacity = "0.5";

  placeholder = document.createElement("div");
  placeholder.className = "card placeholder";
  placeholder.style.height = `${draggedCard.offsetHeight}px`;
  dragSourceColumn.insertBefore(placeholder, draggedCard.nextSibling);

  if (dragSourceColumn.children.length === 1) {
    dragSourceColumn.classList.add("empty");
  }

  e.stopPropagation();
}

// Pendant le drag (survol)
export function dragOver(e: DragEvent): void {
  e.preventDefault();
  e.stopPropagation();
  e.dataTransfer!.dropEffect = "move";

  const cardsContainer = (e.target as HTMLElement).closest(".cards");
  if (!cardsContainer) return;

  // Si la colonne est vide, ajoute un placeholder
  if (cardsContainer.children.length === 0 || cardsContainer.classList.contains("empty")) {
    if (!cardsContainer.querySelector(".placeholder")) {
      cardsContainer.appendChild(placeholder!);
    }
    cardsContainer.classList.remove("empty");
    return;
  }

  // Trouve la carte sous le curseur
  const targetCard = (e.target as HTMLElement).closest(".card:not(.placeholder)");
  if (!targetCard || targetCard === placeholder) return;

  // Déplace le placeholder avant/après la carte cible
  const rect = targetCard.getBoundingClientRect();
  const nextSibling = (e.clientY - rect.top) < (rect.height / 2)
    ? targetCard
    : targetCard.nextSibling;

  cardsContainer.insertBefore(placeholder!, nextSibling);
}

// Quand une carte quitte la zone de drop
export function dragLeave(e: DragEvent): void {
  e.stopPropagation();
}

// Quand une carte est déposée
export function drop(e: DragEvent): void {
  e.preventDefault();
  e.stopPropagation();

  const cardsContainer = (e.target as HTMLElement).closest(".cards");
  if (!cardsContainer || !placeholder || !draggedCard) return;

  // Insère la carte à la place du placeholder
  cardsContainer.insertBefore(draggedCard, placeholder);
  cardsContainer.removeChild(placeholder);

  // Réinitialise les styles et états
  draggedCard.style.opacity = "1";
  if (dragSourceColumn!.children.length === 0) {
    dragSourceColumn!.classList.add("empty");
  }

  // Réinitialise tout
  draggedCard = null;
  placeholder = null;
  dragSourceColumn = null;
}

// Quand le drag est terminé (même si pas de drop)
export function dragEnd(e: DragEvent): void {
  e.stopPropagation();

  if (draggedCard) {
    draggedCard.style.opacity = "1";
  }

  if (placeholder) {
    placeholder.parentNode!.removeChild(placeholder);
    if (dragSourceColumn && dragSourceColumn.children.length === 0) {
      dragSourceColumn.classList.add("empty");
    }
  }

  // Réinitialise tout
  draggedCard = null;
  placeholder = null;
  dragSourceColumn = null;
}