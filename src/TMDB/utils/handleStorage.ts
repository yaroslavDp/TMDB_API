export function handleStorage(movieId: string | undefined){
    const favorites = getFavorites();
    const index = favorites.indexOf(movieId);

    if (index === -1) {
        favorites.push(movieId);
    } else {
        favorites.splice(index, 1);
    }

    saveFavorites(favorites);
    const likeButton = document.querySelector(`[data-id="${movieId}"]`);
    if(likeButton){
        likeButton?.classList.toggle('liked');
    }
}

export function getFavorites() {
    const favoritesJson = localStorage.getItem('favorites');
    return favoritesJson ? JSON.parse(favoritesJson) : [];
}

function saveFavorites(favorites: []) {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}