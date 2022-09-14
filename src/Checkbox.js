import { useRef } from 'react';
import PropTypes from 'prop-types';

function Checkbox(props) {
    const randomId = 'checkbox-' + Math.random().toString().replace('.', '');

    return (
        <div className={'kb-checkbox' + (props.className ? ' ' + props.className : '')}>
            <input id={props.id ? props.id + '-' + randomId : randomId} className="kb-checkbox__input" type="checkbox" name={props.name} checked={props.checked} onChange={props.onChange} />
            <label className="kb-checkbox__layout" for={props.id ? props.id + '-' + randomId : randomId}>
                <div className="kb-checkbox__faux"></div>
                <div className="kb-checkbox__label kb-text--small">{props.label}</div>
            </label>
        </div>
    );
}

Checkbox.propTypes = {
    id: PropTypes.string,
    label: PropTypes.string,
    name: PropTypes.string,
    checked: PropTypes.bool,
}

export default Checkbox;