'use strict';

const R = React.createElement;

class BattleContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
		playerHealth: 100,
		playerMaxHealth: 100,
		playerAttack: 1,
		enemyHealth: 1,
		enemyMaxHealth: 1,
		enemyAttack: 1, // Damage dealt on attack
		enemySpeed: 1 // Attacks per second
	};
  }
  
  enemyDeathCheck(){
    if(this.state.enemyHealth < 1){
		this.newEnemy();
	}
  }
  
  newEnemy(){
	  var tempAttack = this.state.enemyAttack;
	  var tempSpeed = this.state.enemySpeed;
	  var tempHealth = this.state.enemyMaxHealth + 1;
	  console.log('in newEnemy. tempHealth = '+ tempHealth);
	  if (tempHealth > 10){
		  console.log('reset health');
		  tempHealth = 1;
		  tempAttack += 1;
	  }
	  if (tempAttack > 10){
		  tempAttack = 1;
		  tempSpeed += 1;
	  }
	  
	  clearInterval(this.interval);
	  this.interval = setInterval(() => this.enemyAttack(), 1000 / this.state.enemySpeed);
	  
	  this.setState((state) => {
		  return {enemyHealth: tempHealth, enemyMaxHealth: tempHealth, enemyAttack: tempAttack, enemySpeed: tempSpeed};
	  }, function(){console.log('setState complete')})
  }
  
  playerAttack(){
	var component = this;
	this.setState((state) => {
		return {enemyHealth: state.enemyHealth -= state.playerAttack};
	}, component.enemyDeathCheck);
  }
  
  enemyAttack(){
	this.setState((state) => {
		return {playerHealth: state.playerHealth -= state.enemyAttack};
	});
  }
  
  componentDidMount() {
    this.interval = setInterval(() => this.enemyAttack(), 1000 / this.state.enemySpeed);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
	  if (this.state.playerHealth < 1){
		  return R('p', null, 'Game Over!');
	  }
    // return R(
      // 'button',
      // { onClick: () => this.setState({ liked: true }) },
      // 'Like'
    // );
    return R(
		'div', null, 
		R(	// Player Health Bar
			'div', null, this.state.playerHealth, '/', this.state.playerMaxHealth
		), R( // Attack Button
			'button', { onClick: () => this.playerAttack() }, 'ATTACK!!!'
		), R(	// enemy Health Bar
			'div', null, this.state.enemyHealth, '/', this.state.enemyMaxHealth
		), R(	// enemy stats
			'div', null, 
			R(
				'p', null, 'Enemy Attack Damage: ', this.state.enemyAttack
			), R(
				'p', null, 'Enemy Attacks per Second: ', this.state.enemySpeed
			)
		)
	);
  }
}

const domContainer = document.getElementById('battle-container');
ReactDOM.render(R(BattleContainer), domContainer);