interface IProps {
  open: boolean;
}
function FullAreaLoader({ open }: IProps) {
  return (
    <>
      {open && (
        <div className="absolute  h-full w-full top-0 z-999999">
          <div
            className="flex justify-center items-center h-full flex-col gap-5"
            style={{ background: 'rgba(0,0,0,0.5)' }}
          >
            <div className="rounded-full h-15 w-15 bg-violet-800 animate-ping"></div>
            <p className="text-white">Please wait...</p>
          </div>
        </div>
      )}
    </>
  );
}

export default FullAreaLoader;
