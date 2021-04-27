import React, { Fragment } from 'react'
import '../../App.css';
import { Link, Redirect } from 'react-router-dom'
import { logout } from '../../actions/auth'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'


class Navbar extends React.Component {

  constructor(props) {
    super(props)
    this.guestLinks = (
      <ul>
        <li><Link to="/profiles">Developers</Link></li>
        <li><Link to="/register">Register</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul>
    )
    this.authLinks = (
      <ul>
        <li><Link to="/profiles">Developers</Link></li>
        <li>
          <Link to="/dashboard">
            <i className='fas fa-user'></i>{"  "}
            <span className='hide-sm'>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link onClick={this.props.logout} to="/login">
            <i className='fas fa-sign-out-alt'></i>{"  "}
            <span className='hide-sm'>Logout</span>
          </Link>
        </li>
      </ul>
    )
  }

  render() {

    return (
      <nav className="navbar bg-dark">
        <h1>
          <Link to="/">
            <i className="fas fa-code">
            </i>
              DevConnector
            </Link>
        </h1>
        {this.props.auth.isAuthenticated}
        {!this.props.auth.loading && (
          <Fragment>{this.props.auth.isAuthenticated ? this.authLinks : this.guestLinks}</Fragment>
        )}
      </nav>
    )
  }
}

Navbar.prototypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = state => {
  return ({
    auth: state.auth
  }
  )
}

export default connect(mapStateToProps, { logout })(Navbar);