import { Switch, VisuallyHidden, useSwitch } from "@nextui-org/react";

export default function SwitchButton(props){
    const {
        Component,
        slots,
        isSelected,
        getBaseProps,
        getInputProps,
        getWrapperProps
    } = useSwitch(props);

    return (
        <div className="flex flex-col gap-2">
            <Component {...getBaseProps()}>
                <VisuallyHidden>
                    <input {...getInputProps()} />
                </VisuallyHidden>
                <div
                    {...getWrapperProps()}
                    className={slots.wrapper({
                        class: [
                            "w-8 h-8",
                            "flex items-center justify-center",
                            "rounded-lg bg-default-100 hover:bg-default-200",
                        ],
                    })}
                >
                    {isSelected ? '🔼' : '🔻'}
                </div>
            </Component>
            <p className="text-default-500 select-none">{isSelected ? "long" : "short"}</p>
        </div>
    )
}