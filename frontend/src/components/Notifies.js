import "../styles/Notifies.css"
export const Notifies = ({notifiesTable}) => {
    let notifiesElements = notifiesTable.map(el=><div key={el.id}>{el.text}</div>);
    return(
        <div className={"notifyContainer"}>
            {notifiesElements}
        </div>
    )
};