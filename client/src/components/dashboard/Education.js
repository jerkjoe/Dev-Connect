import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { deleteEducation } from '../../actions/profile';
import Moment from 'react-moment';

const Education = ({ education, deleteEducation }) => {
    const educations = education.map(education => {
        return (
            <tr key={education._id}>
                <td>{education.school}</td>
                <td className="hide-sm">{education.degree}</td>
                <td className="hide-sm">
                    <Moment format="YYYY/MM/DD">{education.from}</Moment> -{' '}
                    {console.log(education.to)}
                    {education.to === null ? (
                        'Now'
                    ) : (
                        <Moment format="YYYY/MM/DD">{education.to}</Moment>
                    )}
                </td>
                <td>
                    <button
                        onClick={() => {
                            deleteEducation(education._id);
                        }}
                        className="btn btn-danger"
                    >
                        Delete
                    </button>
                </td>
            </tr>
        );
    });
    return (
        <div>
            <h2 className="my-2">Education Credentials</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>School</th>
                        <th className="hide-sm">Degree</th>
                        <th className="hide-sm">Years</th>
                        <th />
                    </tr>
                </thead>
                <tbody>{educations}</tbody>
            </table>
        </div>
    );
};

Education.propTypes = {
    education: PropTypes.array.isRequired,
    deleteEducation: PropTypes.func.isRequired
};

export default connect(null, { deleteEducation })(Education);
