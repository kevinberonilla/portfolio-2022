import PropTypes from 'prop-types';
import './Checkbox.scss';

function Checkbox({ className, label, name, checked, onChange }) {
    const randomId =
        'checkbox-' +
        Math.random()
            .toString()
            .replace('.', '');

    function handleCheckboxChange(event) {
        if (typeof onChange === 'function') {
            onChange(event);
        }
    }

    return (
        <div className={'kb-checkbox' + (className ? ' ' + className : '')}>
            <input
                id={randomId}
                className="kb-checkbox__input"
                type="checkbox"
                name={name}
                checked={checked}
                onChange={handleCheckboxChange}
            />
            <label className="kb-checkbox__layout" htmlFor={randomId}>
                <div className="kb-checkbox__faux"></div>
                <div className="kb-checkbox__label kb-text-size--small">{label}</div>
            </label>
        </div>
    );
}

Checkbox.propTypes = {
    className: PropTypes.string,
    label: PropTypes.string,
    name: PropTypes.string,
    checked: PropTypes.bool,
    onChange: PropTypes.func,
};

export default Checkbox;
