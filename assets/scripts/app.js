const ATTAKC_VALUE = 10;
const MONSTE_ATTACK_VALUE = 14;
const STRONG_ATTACK_VALUE = 17;
const HEAL_VALUE = 20;
const MODE_ATTACK = "ATTACK";
const MODE_STRONG_ATTACK = "STRONG_ATTACK";
const LOG_EVENT_PLAYER_ATTACK = "PLAYER_ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVENT_GAME_OVER = "GAME_OVER";

let battleLog = [];
let lastLoggedEntry;

function getMaxLifeValues() {
  const enteredHealth = prompt("Maximum life for you and the monster.", "100");

  let parsedValue = parseInt(enteredHealth);
  if (isNaN(parsedValue) || parsedValue <= 0) {
    throw { message: "invalid user input , not a number!" };
  }
  return parsedValue;
}
let choseMaxLife;
try {
  choseMaxLife = getMaxLifeValues();
} catch (error) {
  console.log(error);
  choseMaxLife = 100;
  alert("you entered something wrong , default value : 100");
}
let curretPlayerHealth = choseMaxLife;
let curretMonsterHealth = choseMaxLife;
let hasBonusLife = true;
adjustHealthBars(choseMaxLife);
function writeLog(ev, val, mosterHealth, playerHealth) {
  let logEntery;
  switch (ev) {
    case LOG_EVENT_PLAYER_ATTACK:
      logEntery = {
        event: ev,
        value: val,
        target: "MOSTER",
        finalMosterHaelth: mosterHealth,
        finalPlayerHealth: playerHealth,
      };
      break;
    case LOG_EVENT_PLAYER_STRONG_ATTACK:
      logEntery = {
        event: ev,
        value: val,
        target: "MOSTER",
        finalMosterHaelth: mosterHealth,
        finalPlayerHealth: playerHealth,
      };
      break;
    case LOG_EVENT_MONSTER_ATTACK:
      logEntery = {
        event: ev,
        value: val,
        target: "PLAYER",
        finalMosterHaelth: mosterHealth,
        finalPlayerHealth: playerHealth,
      };
      break;
    case LOG_EVENT_PLAYER_HEAL:
      logEntery = {
        event: ev,
        value: val,
        finalMosterHaelth: mosterHealth,
        finalPlayerHealth: playerHealth,
      };
      break;
    case LOG_EVENT_GAME_OVER:
      logEntery = {
        event: ev,
        value: val,
        finalMosterHaelth: mosterHealth,
        finalPlayerHealth: playerHealth,
      };
      break;
    default:
      logEntery = {};
  }
  // if (ev === LOG_EVENT_PLAYER_ATTACK) {
  //   logEntery = {
  //     event: ev,
  //     value: val,
  //     target: "MOSTER",
  //     finalMosterHaelth: mosterHealth,
  //     finalPlayerHealth: playerHealth,
  //   };
  // } else if (ev === LOG_EVENT_PLAYER_STRONG_ATTACK) {
  //   logEntery = {
  //     event: ev,
  //     value: val,
  //     target: "MOSTER",
  //     finalMosterHaelth: mosterHealth,
  //     finalPlayerHealth: playerHealth,
  //   };
  // } else if (ev === LOG_EVENT_MONSTER_ATTACK) {
  //   logEntery = {
  //     event: ev,
  //     value: val,
  //     target: "PLAYER",
  //     finalMosterHaelth: mosterHealth,
  //     finalPlayerHealth: playerHealth,
  //   };
  // } else if (ev === LOG_EVENT_PLAYER_HEAL) {
  //   logEntery = {
  //     event: ev,
  //     value: val,
  //     finalMosterHaelth: mosterHealth,
  //     finalPlayerHealth: playerHealth,
  //   };
  // } else if (ev === LOG_EVENT_GAME_OVER) {
  //   logEntery = {
  //     event: ev,
  //     value: val,
  //     finalMosterHaelth: mosterHealth,
  //     finalPlayerHealth: playerHealth,
  //   };
  // }
  battleLog.push(logEntery);
}

function reset() {
  curretPlayerHealth = choseMaxLife;
  curretMonsterHealth = choseMaxLife;
  resetGame(choseMaxLife);
}

function endRound() {
  const initialPlayerHealth = curretPlayerHealth;
  const playerDamage = dealPlayerDamage(MONSTE_ATTACK_VALUE);
  curretPlayerHealth -= playerDamage;
  writeLog(
    LOG_EVENT_MONSTER_ATTACK,
    playerDamage,
    curretMonsterHealth,
    curretPlayerHealth
  );
  if (curretPlayerHealth <= 0 && hasBonusLife) {
    hasBonusLife = false;
    removeBonusLife();
    curretPlayerHealth = initialPlayerHealth;
    setPlayerHealth(initialPlayerHealth);
    alert("you would be dead but bonus life saved you!");
  }
  if (curretMonsterHealth <= 0 && curretPlayerHealth > 0) {
    alert("You won!");
    writeLog(
      LOG_EVENT_GAME_OVER,
      "PLAYER_WON",
      curretMonsterHealth,
      curretPlayerHealth
    );
  } else if (curretPlayerHealth <= 0 && curretMonsterHealth > 0) {
    alert("you lose!");
    writeLog(
      LOG_EVENT_GAME_OVER,
      "MONSTER_WON",
      curretMonsterHealth,
      curretPlayerHealth
    );
  } else if (curretMonsterHealth <= 0 && curretPlayerHealth <= 0) {
    alert("YOu have a draw!");
    writeLog(
      LOG_EVENT_GAME_OVER,
      "A_DRAW",
      curretMonsterHealth,
      curretPlayerHealth
    );
  }
  if (
    (curretMonsterHealth <= 0 && curretPlayerHealth > 0) ||
    (curretPlayerHealth <= 0 && curretMonsterHealth > 0) ||
    (curretMonsterHealth <= 0 && curretPlayerHealth <= 0)
  ) {
    reset();
  }
}

function attackMoster(mode) {
  let maxDamage = mode === MODE_ATTACK ? ATTAKC_VALUE : STRONG_ATTACK_VALUE;
  let logEvent =
    mode === MODE_ATTACK
      ? LOG_EVENT_PLAYER_ATTACK
      : LOG_EVENT_PLAYER_STRONG_ATTACK;
  // if (mode === MODE_ATTACK) {
  //   maxDamage = ATTAKC_VALUE;
  //   logEvent = LOG_EVENT_PLAYER_ATTACK;
  // } else if (mode === MODE_STRONG_ATTACK) {
  //   maxDamage = STRONG_ATTACK_VALUE;
  //   logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
  // }
  const damage = dealMonsterDamage(maxDamage);
  curretMonsterHealth -= damage;
  writeLog(logEvent, damage, curretMonsterHealth, curretPlayerHealth);
  endRound();
}

function attackHandler() {
  attackMoster(MODE_ATTACK);
}
function strongAttackHandler() {
  attackMoster(MODE_STRONG_ATTACK);
}
function healPlayerHandler() {
  let healValue;
  if (curretPlayerHealth >= choseMaxLife - HEAL_VALUE) {
    alert("you can't heal to more than your max initial health");
    healValue = choseMaxLife - curretPlayerHealth;
  } else {
    healValue = HEAL_VALUE;
  }
  increasePlayerHealth(HEAL_VALUE);
  writeLog(
    LOG_EVENT_PLAYER_HEAL,
    healValue,
    curretMonsterHealth,
    curretPlayerHealth
  );
  curretPlayerHealth += HEAL_VALUE;
  endRound();
}

function printLogHandler() {
  console.log(battleLog);
}
attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayerHandler);
logBtn.addEventListener("click", printLogHandler);
