import '../styles/Model.css';

const Model = ({ children, onClose }) => {
  return (
    <>
      <div className='backdrop' onClick={onClose}></div>
      <dialog className='modal' open>
        {children}
      </dialog>
    </>
  );
}

export default Model;
