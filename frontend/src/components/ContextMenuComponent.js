import "../styles/ContextMenu.css"

export const ContextMenuComponent = ({visible, x, y, options}) => {
    if (!visible) {
        return null;
    }
    const optionComponents = options.map(o => (<li onClick={o[1]} key={o[0]}> {o[0]} </li>));
    return (
        <div id={"context-menu"} style={{
            top: y,
            left: x
        }}>
            <ul>
                {optionComponents}
            </ul>
        </div>
    )
};