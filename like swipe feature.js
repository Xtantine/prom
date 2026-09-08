let likes = JSON.parse(localStorage.getItem('prom_likes')) || {}; // { username: ["likedUser1", "likedUser2"] }
let matchHistory = []; // Stack to support undoing previous actions