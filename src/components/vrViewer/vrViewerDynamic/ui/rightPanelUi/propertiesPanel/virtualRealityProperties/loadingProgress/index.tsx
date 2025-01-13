const LoadingProgress = ({progress}:{progress:number}) => {
    return (  
        <div
            className="bg-darkest-grey"
            style={{
                width:`80%`,
                height:`5px`,
                border:`1px solid black`,
                borderRadius:`4px`,
                overflow:`hidden`
            }}
        >
            <div
                className="bg-light-green"
                style={{
                    width:`${progress}%`,
                    height:`100%`,
                }}
            />
        </div>
    );
}
 
export default LoadingProgress;