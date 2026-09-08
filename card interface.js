function renderMatches() {
  const container = document.getElementById('matchList');
  container.innerHTML = '';

  const potentialMatches = users.filter(u => 
    u.username !== currentUser.username && u.gender !== currentUser.gender
  );

  // Filter out users that have already been acted on, unless reviewing
  const unactedMatches = potentialMatches.filter(u => {
    const userLikes = likes[currentUser.username] || [];
    return !userLikes.includes(u.username);
  });

  if (unactedMatches.length === 0) {
    container.innerHTML = `<p style="font-size:0.85rem; opacity:0.6;">No more matches available! Check back later.</p>`;
    return;
  }

  const currentMatch = unactedMatches[0];
  const isMutualMatch = checkMutualMatch(currentUser.username, currentMatch.username);

  const card = document.createElement('div');
  card.className = 'match-card';
  card.innerHTML = `
    <div style="display:flex; align-items:center; gap:10px;">
      <span style="font-size:1.4rem;">${currentMatch.avatar}</span>
      <div>
        <strong>${currentMatch.username}</strong>
        <div style="font-size:0.7rem; opacity:0.7;">${currentMatch.gender}</div>
      </div>
    </div>
    
    <div style="display:flex; gap:8px; margin-top:10px;">
      <button onclick="handleSwipe('${currentMatch.username}', 'pass')" style="background:#888;">❌ Pass</button>
      <button onclick="handleSwipe('${currentMatch.username}', 'like')">💖 Like</button>
      ${matchHistory.length > 0 ? `<button onclick="undoLastAction()" style="background:#f59e0b;">↩️ Rewind</button>` : ''}
    </div>

    ${isMutualMatch ? `
      <div style="margin-top:10px; color: #a855f7; font-weight:bold;">It's a Match! 🎉</div>
      <button onclick="openDM('${currentMatch.username}')">Send Message</button>
    ` : ''}
  `;

  container.appendChild(card);
}

function handleSwipe(targetUsername, action) {
  // Save state for rewind functionality
  matchHistory.push({ targetUsername, action });

  if (action === 'like') {
    if (!likes[currentUser.username]) likes[currentUser.username] = [];
    likes[currentUser.username].push(targetUsername);
    localStorage.setItem('prom_likes', JSON.stringify(likes));
  }

  renderMatches();
}

function undoLastAction() {
  if (matchHistory.length === 0) return;

  const lastAction = matchHistory.pop();
  if (lastAction.action === 'like') {
    likes[currentUser.username] = likes[currentUser.username].filter(u => u !== lastAction.targetUsername);
    localStorage.setItem('prom_likes', JSON.stringify(likes));
  }

  renderMatches();
}

function checkMutualMatch(user1, user2) {
  const user1Likes = likes[user1] || [];
  const user2Likes = likes[user2] || [];
  return user1Likes.includes(user2) && user2Likes.includes(user1);
}