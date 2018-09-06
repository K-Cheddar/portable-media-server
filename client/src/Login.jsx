import React, { Component }  from 'react';
import PouchDB from 'pouchdb';

var dbName = process.env.REACT_APP_DATABASE_STRING + "portable-media-logins"
var db = new PouchDB(dbName);

export default class Login extends Component {

  constructor() {
    super();

    this.state = {
      username: "",
      password: "",
      wrongCred: false,
      isMobile: false
    }
  }

  usernameChange = (event) => {
    this.setState({username: event.target.value});
  }

  passwordChange = (event) => {
    this.setState({password: event.target.value});
  }

  componentDidMount(){
    if( navigator.userAgent.match(/Android/i)
      || navigator.userAgent.match(/webOS/i)
      || navigator.userAgent.match(/iPhone/i)
      || navigator.userAgent.match(/iPod/i)
      || navigator.userAgent.match(/BlackBerry/i)
      || navigator.userAgent.match(/Windows Phone/i)
    ){
      this.setState({isMobile: true})
    }
  }

  login = (event) => {

    event.preventDefault();
    let {username, password, isMobile} = this.state;
    let that = this;
    db.get('logins').then(function(doc){
      let obj = doc.logins.find(e => e.username === username);
      if(!obj)
        that.setState({wrongCred: true})
      else if (obj.password === password){
        that.props.login(obj.database, obj.username, obj.upload_preset);
        that.setState({wrongCred: false})
        if(isMobile)
          that.props.history.push("/mobile");
        else
          that.props.history.push("/fullview");
      }
      else{
        that.setState({wrongCred: true})
      }
    })


  }

  render() {

    return (
      <div style={{color:'black', backgroundColor:'#c4c4c4', width:'50vh', height: '25vh', margin: 'auto', marginTop: '32.5vh',
        fontSize:'calc(12px + 1vh)'}}>
          <form style={{width: '65%', margin: 'auto'}} onSubmit={this.login}>
            <ul style={{width: ''}}>
              <li style={{paddingTop: '2vh'}}>
                <label > Username: </label>
                <input type="text" value={this.state.username} onChange={this.usernameChange} />
              </li>
              <li style={{paddingTop: '2vh'}}>
                <label> Password:  </label>
                <input type="password" value={this.state.password} onChange={this.passwordChange} />
              </li>
              <li style={{paddingTop: '2vh', height: '5vh', display: 'flex'}}>
                <input style={{fontSize:'calc(12px + 1vh)'}} type="submit" value="Submit" />
                  {this.state.wrongCred &&
                    <p style={{color:'#f70000', width: '40vw'}}>The username and password combination do not match</p>
                  }
              </li>
            </ul>
          </form>
      </div>
    )
  }
}
