import PropTypes from 'prop-types';

function Checkbox(props) {
    const randomId = 'checkbox-' + Math.random().toString().replace('.', '');

    return (
        <div className={'kb-checkbox' + (props.className ? ' ' + props.className : '')}>
            <input id={randomId} className="kb-checkbox__input" type="checkbox" name={props.name} checked={props.checked} onChange={props.onChange} />
            <label className="kb-checkbox__layout" htmlFor={randomId}>
                <div className="kb-checkbox__faux"></div>
                <div className="kb-checkbox__label kb-text-size--small">{props.label}</div>
            </label>
        </div>
    );
}

Checkbox.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string,
    checked: PropTypes.bool,
    onChange: PropTypes.func
}

export default Checkbox;