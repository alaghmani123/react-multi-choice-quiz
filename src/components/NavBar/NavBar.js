import React, { Component } from 'react'
import { Navbar, NavItem } from 'react-materialize'
// import './NavBar.css'

class NavBar extends Component {

  render() {
      console.log(this.props)
    let navBarItems = [<NavItem key={1} href='/'>Home</NavItem>]
    if (this.props.isLoggedIn) {
      navBarItems.push(<NavItem key={2} href='/logout'>Log Out</NavItem>)
      
        if (this.props.user != null) {
            navBarItems.push(<NavItem key={5} href='/profile'>{this.props.user.email}</NavItem>)
        }  

    } else {
      navBarItems.push(<NavItem key={3} href='/signup'>Sign Up</NavItem>)
      navBarItems.push(<NavItem key={4} href='/login'>Log In</NavItem>)
    }
    return (
      <Navbar className='nav' right>
        {navBarItems}
      </Navbar>
    )
  }
}

export default NavBar
