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
      <div>
          <form onSubmit={this.login}>
            <ul className="">
              <li className="">
                <label> Username: </label>
                <input className="" type="text" value={this.state.username} onChange={this.usernameChange} />
              </li>
              <li className="">
                <label> Password:  </label>
                <input className="" type="password" value={this.state.password} onChange={this.passwordChange} />
              </li>
              <li >
                <input className="" type="submit" value="Submit" />
              </li>
              {this.state.wrongCred &&
                <p style={{padding:'2vh', color:'#f70000'}}>The username and password combination do not match</p>
              }
            </ul>
          </form>
      </div>
    )
  }
}
