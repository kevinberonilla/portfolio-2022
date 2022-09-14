import {forwardRef, useImperativeHandle, useState} from 'react';
import PropTypes from 'prop-types';

const ProjectModal = forwardRef((props, ref) => {
    const [backdropPosition, setBackdropPosition] = useState({});
    const [shown, setShown] = useState(false);

    function showModal() {
        window.document.body.classList.add('kb-freeze');
        const projectLinkBounds = window.document.querySelector('.kb-project__link[href="' + props.project.hash + '"]').getBoundingClientRect();

        setBackdropPosition({
            top: projectLinkBounds.top + 'px',
            right: projectLinkBounds.left + projectLinkBounds.width + 'px',
            bottom: projectLinkBounds.top + projectLinkBounds.height + 'px',
            left: projectLinkBounds.left + 'px',
            width: projectLinkBounds.width + 'px',
            height: projectLinkBounds.height + 'px',
        });

        setTimeout(() => {
            setBackdropPosition({
                inset: '0',
                width: '100vw',
                height: 'calc(var(--kb-vh) * 100)',
                opacity: '1'
            });

            setShown(true);
        }, 100);
    }

    function hideModal() {
        window.document.body.classList.remove('kb-freeze');
        setShown(false);

        if (typeof props.onHidden === 'function') {
            window.setTimeout(() => {
                props.onHidden();
            }, 100);
        }
    }

    useImperativeHandle(ref, () => ({
        show() {
            showModal();
        },
        hide() {
            hideModal();
        }
    }));

    return (
        <div className={'kb-project-modal' + (shown ? ' kb-project-modal--shown' : '') + (props.className ? ' ' + props.className : '')}>
            <div className="kb-project-modal__backdrop" style={backdropPosition}>
                <img className="kb-project-modal__background" src={props.project.thumbnailUrl} alt={props.project.name} />
            </div>
            <div className={'kb-project-modal__content' + (shown ? ' kb-project-modal__content--shown' : '')}>
                <h2 className="kb-text-heading--large kb-m-vertical--none">{props.project.name}</h2>

                Hello
                <button onClick={hideModal}>Hide</button>
            </div>
        </div>
    );
});

ProjectModal.propTypes = {
    className: PropTypes.string,
    project: PropTypes.object,
    onHidden: PropTypes.func
}

export default ProjectModal;