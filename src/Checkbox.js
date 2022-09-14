import './css/Checkbox.css';
import { useRef } from 'react';
import PropTypes from 'prop-types';

function Checkbox(props) {
    const root = useRef();

    return (
        <label ref={root} className="kb-checkbox">
            <input type="checkbox" name={props.name} checked={props.checked} onChange={props.onChange} />
            <div className="kb-checkbox__label kb-text--small">{props.label}</div>
        </label>
    );
}

Checkbox.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string,
    checked: PropTypes.bool
}

export default Checkbox;