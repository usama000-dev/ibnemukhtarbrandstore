import { RxSquare } from "react-icons/rx";

function BorderSection({ className = "" }) {
  return (
    <div className={`flex items-center justify-center w-full ${className}`}>
      <span className='h-[1px] flex-grow bg-[#333]/40 max-w-[80px]'></span>
      <RxSquare className='rotate-[45deg] text-[#555555] text-[10px] p-0 m-0' />
      <span className='h-[1px] flex-grow bg-[#333]/40 max-w-[80px]'></span>
    </div>
  );
}

export default BorderSection;