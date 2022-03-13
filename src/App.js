import React from "react"
import Die from "./components/Die"
import { nanoid } from "nanoid"

import Confetti from "react-confetti"

export default function App() {

  function allNewDice() {
    const diceArr = []
    for (let i=0; i < 10; i++) {
      diceArr.push({
        id: nanoid(),
        value: Math.ceil(Math.random()*6),
        isHeld: false
      })
    }

    return diceArr
  }

  const [dice, setDice] = React.useState(allNewDice())

  const dieElements = dice.map(die => (
    <Die
      key={die.id}
      id={die.id} 
      value={die.value}
      isHeld={die.isHeld}
      handleClick={holdDice}
    />
  ))

  
  const [tenzies, setTenzies] = React.useState(false)

  const [best, setBest] = React.useState(localStorage.getItem("best") || 0)
  const [moveCount, setMoveCount] = React.useState(0)

  function rollDice() {
    //setDice(allNewDice())
    
    if (tenzies) {
      setDice(allNewDice())
      
      //reset game state
      setTenzies(false)
      //reset move count
      setMoveCount(0)
      
    } else {
      //add to move count
      setMoveCount(prevCount => prevCount + 1)
      //roll unheld dice
      setDice(prevDice => prevDice.map(die => {
        return !die.isHeld ? 
          {...die, value: Math.ceil(Math.random()*6)} :
          die
      }))
    }
  }

  function holdDice(id) {
    setDice(prevDice => {
      return prevDice.map(die => ({
        ...die,
        isHeld: die.id === id ? !die.isHeld : die.isHeld
      }))
    })
  }

  //confetti

  React.useEffect(function() {
    //check if all is held values are true with filter
    //const notHeld = dice.filter(die => !die.isHeld)

    //with every
    const allHeld = dice.every(die => die.isHeld)
    //check if all dice have same actual valuee
    const allSame = dice.every(die => die.value === dice[0].value)

    
    //tenzies ? setBtnText("New Game") : setBtnText("Roll")
    if (allHeld && allSame) {    
      //set best function
      if (best === "0" || moveCount < best) {
        setBest(moveCount)
      } 
      
      //save to local storage
      localStorage.setItem("best", best)
      
      setTenzies(true)
      console.log("You won!")
    }
  }, [dice, tenzies, best, moveCount])

  //console.log(allNewDice())


  return( 
    <div className="container">
      <main className="main">
        {tenzies && <Confetti />}
        <h1 className="title">Tenzies</h1>
        <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
        <div className="dice-container">
          {dieElements}
        </div>
        <button className="btn-roll" onClick={rollDice}>{tenzies ? "New Game" : "Roll"}</button>
        <div className="scores">
          <h4>Best: {best}</h4>
          <p>Moves: {moveCount}</p>

        </div>
      </main>
    </div>
  )
}