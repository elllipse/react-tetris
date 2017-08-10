import React from 'react';
require('./GameOverMenu.css')

const GameOverMenu = ({ restartGame }) => (
  <div className='game_over'>
    <div className='btn_restart' onClick={restartGame}>play again</div>
  </div>
)

export default GameOverMenu;