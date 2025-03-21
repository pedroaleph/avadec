const Loading = () => {
    return (
        <div className="position-absolute top-0 bottom-0 start-0 end-0 p-3 mt-5 pt-4">
            <div className="w-100 h-100 bg-passive rounded-2 d-flex align-items-center justify-content-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
    );
};

export default Loading;
