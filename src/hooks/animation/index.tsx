import _ from "lodash";

type OptionsType = {
    duration:number,
    delay?:number,
    onStart?:Function,
    ease?: 
    `power2.in` | `power2.out` | `power2.inOut` | 
    `power3.in` | `power3.out` | `power3.inOut` |
    `power4.in` | `power4.out` | `power4.inOut` 
    onUpdate?:(progress:number) =>void,
    onComplete?:Function,
}&{
    [key: string]: any;
};

const defaultKeys = ['delay', 'duration', 'onStart', 'onUpdate', 'onComplete']
const useAnimation = () => {
    const animate = (object: any, options: OptionsType) => {
        const intervalMs = 4
        setTimeout(()=>{
            let progress = 0
            let functionedProgress = 0
            const totalSteps = (options.duration * 1000) / intervalMs
            const objectStart:any = {}

            const powerInOut = (progress:number, power:number)=>{
                if ((progress *= 2) < 1) return 0.5 * Math.pow(progress, power);
                return 1 - 0.5 * Math.abs(Math.pow(2 - progress, power));
            }

            const powerOut = (progress:number, power:number)=> {
                return 1 - Math.pow(1 - progress, power);
            }
            
    
            const keysToEdit = Object.keys(options).filter(key => !defaultKeys.includes(key));
            keysToEdit.forEach(key => {
                objectStart[key] = Number(object[key]);
            });

            // On Start
            if(options.onStart){
                options.onStart();
            }
    
            // On Update
            const interval = setInterval(() => {
                progress += (1 / totalSteps);

                // Power 2
                if(options.ease === `power2.in`){
                    functionedProgress = Math.pow(progress, 2)
                }
                else if(options.ease === `power2.out`){
                    functionedProgress =  powerOut(progress, 2)
                }
                else if(options.ease === `power2.inOut`){
                    functionedProgress = powerInOut(progress, 2)
                }
                // Power 3
                else if(options.ease === `power3.in`){
                    functionedProgress = Math.pow(progress, 3)
                }
                else if(options.ease === `power3.out`){
                    functionedProgress =  powerOut(progress, 3)
                }
                else if(options.ease === `power3.inOut`){
                    functionedProgress = powerInOut(progress, 3)
                }
                // Power 4
                else if(options.ease === `power4.in`){
                    functionedProgress = Math.pow(progress, 4)
                }
                else if(options.ease === `power4.out`){
                    functionedProgress =  powerOut(progress, 4)
                }
                else if(options.ease === `power4.inOut`){
                    functionedProgress = powerInOut(progress, 4)
                }
                else{
                    functionedProgress = progress
                }
                
                keysToEdit.forEach(key => {
                    object[key] = objectStart[key] + ((options[key] - objectStart[key]) * functionedProgress);
                });
                if(options.onUpdate){
                    options.onUpdate(functionedProgress);
                }

                // On Complete
                if (functionedProgress >= 0.99999) {
                    clearInterval(interval);
                    if(options.onComplete){
                        options.onComplete();
                    }
                }
            }, intervalMs); // Interval of 16ms for smoother animation
        }, (options.delay || 0) * 1000)
    };


    return ({animate});
}
 
export default useAnimation;