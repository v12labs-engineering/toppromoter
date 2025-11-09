import Link from 'next/link';

export const Button = (props) => {
  let styles = 'relative inline-flex items-center justify-center font-bold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all';

  //Sizing styles
  if(props.small){
    styles = styles + ' text-white px-4 py-2 text-sm md:text-base'
  } else if(props.xsmall){
    styles = styles + ' text-white px-4 py-2 text-sm md:text-xs'
  } else if(props.medium){
    styles = styles + ' text-white px-6 py-3 text-sm md:text-lg'
  } else if(props.xlarge){
    styles = styles + ' text-white px-8 py-4 text-base md:text-2xl'
  } else {
    styles = styles + ' text-white px-8 py-3 text-sm md:text-xl'
  }

  //Color styles
  if(props.secondary){
    styles = styles + ' text-white font-bold bg-secondary hover:bg-secondary-2'
  } else if(props.gray){
    styles = styles + ' text-gray-800 font-bold bg-gray-300 hover:bg-gray-400'
  } else if(props.white){
    styles = styles + ' bg-white font-bold hover:bg-gray-100'
  } else if(props.red){
    styles = styles + ' text-white font-bold bg-red-500 hover:bg-red-600 focus:ring-red-100'
  } else if(props.ghost){
    styles = styles + ' text-primary font-bold px-0 py-0 focus:outline-none focus:ring-0 focus:ring-offset-0'
  } else if(props.outline){
    styles = styles + ' text-primary font-bold bg-white border-2 border-gray-100'
  } else {
    styles = styles + ' bg-primary font-bold hover:bg-primary-2'
  }

  if(props.mobileFull){
    styles = styles + ' w-full sm:w-auto x'
  }

  if(props.href){
    return(
      <Link
        passHref
        href={ props.href }
        className={ `${styles} ${props.className ? props.className : ''}` }
        onClick={ props.onClick && props.onClick }
        target={ props.external ? '_blank' : '' }>
        { props.children && props.children }
      </Link>
    )
  } else {
    return(
      <button 
        disabled={ props.disabled && props.disabled }
        onClick={ props.onClick && props.onClick }
        className={ `${styles} ${props.className ? props.className : ''}` }>
        { props.children && props.children }
      </button>
    )
  }
};

export default Button;