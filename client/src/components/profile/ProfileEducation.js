import React from 'react'
import PropTypes from 'prop-types'

const ProfileEducation = ({
    education: {
        school, degree, fieldofstudy, to, from, description, current
    }
}) => {
    return (
        <div>
            <h3 className='text-dark'>{school}</h3>
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
                    Degree:
                </strong> 
                {" " + degree}
            </p>
            <p>
                <strong>
                    Field of study:
                </strong> 
                {" " + fieldofstudy}
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

ProfileEducation.propTypes = {
    education: PropTypes.array.isRequired
}

export default ProfileEducation
