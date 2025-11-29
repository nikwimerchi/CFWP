interface IProps {
  open: boolean;
}
function PageLoader({ open }: IProps) {
  return (
    <>
      {open && (
        <div className="fixed  left-0 right-0 top-0 h-screen z-999999">
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

export default PageLoader;
