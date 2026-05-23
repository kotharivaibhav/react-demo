type LoaderProps = {
  fullscreen?: boolean;
};

export const Loader = ({ fullscreen = false }: LoaderProps) => (
  <div className={fullscreen ? 'loader-overlay loader-overlay--fullscreen' : 'loader-overlay'}>
    <div className="loader-spinner" role="status" aria-label="Loading" />
  </div>
);
