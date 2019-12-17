import React, { Component } from 'react';
import quizQuestions from '../../api/quizQuestions';
import Quiz from '../Quiz';
import Result from '../Result';
import LogInForm from '../LogInForm/LogInForm'
import LogOut from '../LogOut/LogOut'
import Questionnaire from '../Questionnaire/Questionnaire'
import SignUpForm from '../SignUpForm/SignUpForm'
import NavBar from '../NavBar/NavBar'
import './App.css';
import axios from 'axios';
import Alert from '../Alert/Alert'


import {
     BrowserRouter as Router,
     Route,
     Link,
    Switch
   } from 'react-router-dom';

  const databaseUrl = process.env.NODE_ENV === 'production' ? process.env.BACKEND_APP_URL : 'http://localhost:3000'


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      isLoggedIn: false,
      backgroundIndex: 0,
      user: null,
      counter: 0,
      questionId: 1,
      question: '',
      answerOptions: [],
      answer: '',
      answersCount: {},
      result: ''
    };

    this.handleAnswerSelected = this.handleAnswerSelected.bind(this);
    this.handleLogIn =  this.handleLogIn.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
  }

  componentDidMount() {
    if (localStorage.token) {
      this.setState({
        isLoggedIn: true
      })
    } else {
      this.setState({
        isLoggedIn: false
      })
    }
    const shuffledAnswerOptions = quizQuestions.map(question =>
      this.shuffleArray(question.answers)
    );
    this.setState({
      question: quizQuestions[0].question,
      answerOptions: shuffledAnswerOptions[0]
    });
  
  }

  handleLogOut = (e) => {
    e.preventDefault()
    window.localStorage.clear()
    this.setState({
      email: '',
      password: '',
      isLoggedIn: false
    })
    this.props.history.push('/login')
  }


  handleInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSignUp = (e) => {
    e.preventDefault()
    let newUser = {
      email: this.state.email,
      password: this.state.password
    }
  axios(
      {
        method: 'post',
        url: `${databaseUrl}/api/users/signup`,
        data: newUser
      })
      .then(response => {
        console.log(response)
        const location = {
          pathname: '/login',
          state: { fromDashboard: true }
        }
        this.props.history.replace(location)
      })
      .catch(err => console.log(err))
  }

  handleLogIn = (e) => {
    e.preventDefault()
    let loginUser = {
      email: this.state.email,
      password: this.state.password
    }
    axios(
      {
        method: 'post',
        url: `${databaseUrl}/api/users/login`,
        data: loginUser
      })
      .then((response) => {
        console.log(response)
        window.localStorage.setItem('token', response.data.token)
        this.setState({
          isLoggedIn: true,
          user: response.data.user,
          email: '',
          password: ''
        })
        const location = {
          pathname: '/Questionnaire',
          state: { fromDashboard: true }
        }
      
        this.props.history.replace(location)
      })
      .catch(err => console.log(err))
  }


  shuffleArray(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  handleAnswerSelected(event) {
    this.setUserAnswer(event.currentTarget.value);

    if (this.state.questionId < quizQuestions.length) {
      setTimeout(() => this.setNextQuestion(), 300);
    } else {
      setTimeout(() => this.setResults(this.getResults()), 300);
    }
  }

  setUserAnswer(answer) {
    this.setState((state, props) => ({
      answersCount: {
        ...state.answersCount,
        [answer]: (state.answersCount[answer] || 0) + 1
      },
      answer: answer
    }));
  }

  setNextQuestion() {
    const counter = this.state.counter + 1;
    const questionId = this.state.questionId + 1;

    this.setState({
      counter: counter,
      questionId: questionId,
      question: quizQuestions[counter].question,
      answerOptions: quizQuestions[counter].answers,
      answer: ''
    });
  }

  getResults() {
    const answersCount = this.state.answersCount;
    const answersCountKeys = Object.keys(answersCount);
    const answersCountValues = answersCountKeys.map(key => answersCount[key]);
    const maxAnswerCount = Math.max.apply(null, answersCountValues);

    return answersCountKeys.filter(key => answersCount[key] === maxAnswerCount);
  }

  setResults(result) {
    if (result.length === 1) {
      this.setState({ result: result[0] });
    } else {
      this.setState({ result: 'Undetermined' });
    }
  }

  renderQuiz() {
    return (
      <Quiz
        answer={this.state.answer}
        answerOptions={this.state.answerOptions}
        questionId={this.state.questionId}
        question={this.state.question}
        questionTotal={quizQuestions.length}
        onAnswerSelected={this.handleAnswerSelected}
      />
    );
  }

  renderResult() {
    return <Result quizResult={this.state.result} />;
  }

  render() {
    return (
      <div>
        <Router>
          <nav>           
                          
                <Link to="/Alert">message</Link>          
                      
          </nav>

          <Switch>
            
            <Route path="/Alert" component={Alert}></Route>
           
         </Switch>
        </Router>  
      
      
      <div>
        <Router>
        <Switch>
            <Route path='/signup'
              render={(props) => {
                return (
                  <SignUpForm isLoggedIn={this.state.isLoggedIn} handleInput={this.handleInput} handleSignUp={this.handleSignUp} />
                )
              }}
            />
            <Route path='/logout'
              render={(props) => {
                return (
                  <LogOut isLoggedIn={this.state.isLoggedIn} handleLogOut={this.handleLogOut} />
                )
              }}
            />
            <Route path='/login'
              render={(props) => {
                return (
                  <LogInForm isLoggedIn={this.state.isLoggedIn} handleInput={this.handleInput} handleLogIn={this.handleLogIn} />
                )
              }}
            />
            <Route path='/Questionnaire'
              render={(props) => {
                return (
                  <Questionnaire isLoggedIn={this.state.isLoggedIn} user={this.state.user} />
                )
              }}
            />
            {/* <Route path='/New'
              render={(props) => {
                return (
                  <LogInForm isLoggedIn={this.state.isLoggedIn} handleAnswerSelected = {this.handleAnswerSelected.bind(this)} />
                )
              }}
            /> */}
            {/* <Route path='/New'/> 
            <Link to="/New">New</Link>  
            render={(props) => {
                return (       */}
              </Switch>
        {this.state.result ? this.renderResult() : this.renderQuiz()}
        <NavBar isLoggedIn={this.state.isLoggedIn} user={this.state.user} />
        {/* <Router basename='/'>
          <nav>          \
            2q2                <Link to="/">Home page</Link>            
                <Link to="/prayer">prayer Time</Link>          
                <Link to="/About">About</Link>
                <Link to="/PrayerToSay">Prayers</Link>           
          </nav>
          <div>
        <h1>Hello {this.props.name}</h1>
        <p>You are {this.props.age} years old</p>
        <p>The initial count is {this.state.counter}
        </p>
        <br />
    <button onClick={(e) => this.handleClick(e)}>click me!</button>
      </div>

          <Switch>
            <Route exact path="/" component={Home}></Route>
            <Route path="/prayer" component={Prayer}></Route>
            <Route path="/About" component={About}></Route>  
            <Route path="/PrayerToSay" component={PrayerToSay}></Route>
         </Switch>
        </Router>   */}
        </Router>
      </div>
      </div>
          // <h2>Messiah Quiz</h2>
      
    );
  }
}

export default App;
