import React, { useEffect } from 'react'
import { Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { getCurrentProfile, deleteAccount } from '../../actions/profile'
import Spinner from '../layout/Spinner';
import DashboardActions from './DashboardActions'
import Experience from './Experience'
import Education from './Education'

const Dashboard = ({ getCurrentProfile, deleteAccount, auth: { user }, profile: { loading, profile } }) => {

    useEffect(() => {
        getCurrentProfile();
    }, [getCurrentProfile])

    return loading && profile === null ? <Spinner /> : <Fragment>
        <h1 className='large text-primary'>Dashboard</h1>
        <p className='lead'>
            <i className='fas fa-user'></i>
            Welcome  {user && user.name}
        </p>
        {
            profile !== null ? <Fragment>
                <DashboardActions></DashboardActions>
                <Experience experience={profile.experience}></Experience>
                <Education education={profile.education}></Education>
                <div className='my-2'>
                    <button className='btn btn-danger' onClick={(e) => deleteAccount()}>
                        <i className='fas fa-user-minus'>
                        </i>
                        {"  "}Delete My Account
                    </button>
                </div>
            </Fragment> : <Fragment>
                <p>You donot have setup a profile yet, please add some info</p>
                <Link to='/create-profile' className='btn btn-primary my-1'>
                    Create Profile
                </Link>
            </Fragment>
        }
    </Fragment>
}

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    deleteAccount: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
    return ({
        auth: state.auth,
        profile: state.profile
    })
}

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(Dashboard)
