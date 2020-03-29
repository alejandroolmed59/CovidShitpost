import React from 'react';
import {dia} from './Date';
import shuffle from 'shuffle-array'
import axios from 'axios'
import ReactTypingEffect from 'react-typing-effect';
import { Button, Form, Input, UncontrolledAlert } from 'reactstrap';
import './App.css'


import './App.css';

setInterval(()=>{}, 1000)

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      dias: "",
      horas:"",
      minutos:"",
      segundos:"",
      Splashes: [],
      response: "",
      mensajeCustom: "",
      alert: false
    })
  }
  changeHandler = (event) => {
    this.setState({
      [event.target.id]: event.target.value,
    })
  }
  submitHandler = event => {
    event.preventDefault();

    const msg = {
      msg: this.state.mensajeCustom
    }

    axios.post('https://controlasistenciacooler.herokuapp.com/covid/create/', msg)
      .then(response => {
        if (response.status === 200) {
          this.setState({ alert: true, mensajeCustom: "" })
        }
      })
      .catch(err => console.log(err))


  }
  tick = () =>{
    var now = new Date();
    var horas = 24 - now.getHours();
    var minutos = 60 - now.getMinutes();
    var segundos = 60- now.getSeconds();
    this.setState({
      horas:horas,
      minutos:minutos,
      segundos:segundos
    })
  }
  fixArr = (array) => {
    const arrayFixed = shuffle(array).map(splash => {
      return splash.msg
    })
    this.setState({ Splashes: arrayFixed })
  }
  componentDidMount() {
    let dias = 112 - dia; //112 ->21 Abril
    if (dias < 0) dias = 0;
    this.setState({ dias: dias });
    let response = "SIIIIIIII";
    let noResponses = ["Nop", "Nopi", "No aun", "Algun día", "Ni de cerca ajjaja", "No", "Nouu", "Intenta mañana lol", "Siiiiii, Wait.. No :(("];
    if (dias !== 0) response = noResponses[Math.floor(Math.random() * noResponses.length)];

    axios.get('https://controlasistenciacooler.herokuapp.com/covid/')
      .then(splahes => { this.fixArr(splahes.data) })
      .catch(err => console.log(err))

    this.setState({
      dias: dias,
      response: response
    })

    this.interval = setInterval(() => this.tick(), 1000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  

  render() {

    return (
      <div className="App" >
        
        {this.state.alert && <UncontrolledAlert color="info">
      Desde ahora tu mensaje sera visible por el MUNDO (osea los que se metan a la pagina xD)
    </UncontrolledAlert>}
        <h1 style={{paddingTop:"1em"}}>Puedo salir a la calle?</h1>
        <h1 className="title">{this.state.response}</h1>
        <div className="marginado">
          <p>Tiempo de cuarentena restante:</p>
          <p>{this.state.dias} dias</p>
          <p >{this.state.horas} horas</p>
          <p >{this.state.minutos} minutos</p>
          <p >{this.state.segundos} segundos</p>
        </div>
        <div className="splashSection">
          <Form >
            <div style={{marginBottom:"1em"}}>
              <Input size={45} className='transparentInput' type="text" name="mensajeCustom" id="mensajeCustom" placeholder="Pongan tusa" onChange={this.changeHandler} value={this.state.mensajeCustom} />
            </div>
            <div>
              <Button color="success" onClick={this.submitHandler}>This should do something <span role="img" aria-label="thinking">🤔</span></Button>
            </div>
          </Form>
          <ReactTypingEffect className='Mine' text={this.state.Splashes} />
        </div>
      </div>
    )
  }
}

export default App;
