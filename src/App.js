import React, {Component} from "react";
import Keycloak from "keycloak-js";
import axiosInstance from "axios"

class Secured extends Component{
  constructor(props){
    super(props);
    this.state = {keycloak: null, authenticated: false};
  }
  
  componentDidMount() {
    const keycloak = Keycloak('/keycloak.json');
    keycloak.init({ onLoad: 'login-required'}).then( authenticated => {
      this.setState({keycloak: keycloak, authenticated: authenticated})
      if (authenticated){
        window.accessToken = keycloak.token;
        axiosInstance.interceptors.request.use(
          config => {
            const token = window.accessToken ? window.accessToken: 'dummy-token';
            config.headers['Authorization'] = 'Bearer ' + token;
            return config;
          },
          error => {
            Promise.reject(error)
          });
        axiosInstance.get('http://localhost:5000/aaaa').then((result) => {
          console.log(result.data);
        });
      }

      else{
        console.log('not loǵged in');
      }
    })
  }

  render(){
    console.log(this.state.keycloak)
    if (this.state.keycloak){
      if (this.state.authenticated) return (
        <div>
          <p>This ia a Keycloak-secured app.</p>
        </div>
      ); else return(<div>Unable to authenticate.</div>)
    }
    return(
      <div>Initialize Keycloak...</div>
    );  
  }
}

export default Secured;
