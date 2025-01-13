const ProgressBar = () => {
    return (
        <>
            {/* Progress bar */}
            <div
                style={{
                    position:`absolute`,
                    margin:`1rem`,
                    width:`calc(100% - 2rem)`,
                    height:`0.5rem`,
                    border:`0.3px solid grey`,
                    borderRadius:`25px`,
                    bottom:`0.5rem`,
                    overflow:`hidden`
                }}
            >
                {/* Bar */}
                <div
                    className="bg-blue"
                    style={{
                        width:`0%`,
                        height:`100%`,
                        borderRadius:`25px`
                    }}
                >
                </div>
            </div>
            
        </>
    );
}
 
export default ProgressBar;