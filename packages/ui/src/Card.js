export const Card = (props) => {
  let styles = 'max-w-3xl border-2 border-gray-100 rounded-lg';

  if(props.secondary){
    styles = styles + ' bg-secondary border-secondary-2';
  } else {
    styles = styles + ' bg-white';
  }

  if(props.className){
    styles = styles + ' ' + props.className;
  }

  return(
    <div className={ styles }>
      <div className="p-6 sm:p-8">
        { props.children }
      </div>
    </div>
  )
};

export default Card;