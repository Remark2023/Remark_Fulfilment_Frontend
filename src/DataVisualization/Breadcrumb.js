import { useCallback } from 'react';

function Breadcrumb(props) {
  const onClick = useCallback(() => {
    props.onClick(props.info.node);
  }, [props]);

  const onKeyDown = useCallback((event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      onClick();
    }
  }, [onClick]);

  return (
    <span>
      <span
        className={props.info.node ? 'link' : ''}
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={onKeyDown}
      >
        {props.info.text}
      </span>
      {props.isLast ? '' : ' > '}
    </span>
  );
}

export default Breadcrumb;
