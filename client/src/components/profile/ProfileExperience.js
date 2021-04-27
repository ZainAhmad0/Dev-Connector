import React from 'react'
import PropTypes from 'prop-types'

const ProfileExperience = ({
    experience: {
        company, location, title, to, from, description, current
    }
}) => {
    return (
        <div>
            <h3 className='text-dark'>{company}</h3>
            <p>
                {
                    from.toString().split('T', 1)
                }
                - {" "}
                {
                    !to ? ('Now') : (to.toString().split('T', 1))
                }
            </p>
            <p>
                <strong>
                    Position:
                </strong> 
                {" " + title}
            </p>
            <p>
                <strong>
                    Description:
                </strong> 
                {" " + description}
            </p>
        </div>
    )
}

ProfileExperience.propTypes = {
    experience: PropTypes.array.isRequired
}

export default ProfileExperience
