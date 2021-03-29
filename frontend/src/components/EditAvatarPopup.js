import React from "react";
import PopupWithForm from "./PopupWithForm";
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function EditAvatarPopup({isOpen, onClose, onUpdateAvatar}) {

    const currentUser = React.useContext(CurrentUserContext);
    const avatarRef = React.useRef();

    function handleSubmit() {
        onUpdateAvatar({
            avatar: avatarRef.current.value
        });
      } 

      React.useEffect(() => {
        avatarRef.current.value = currentUser.avatar;
      }, [currentUser]);
      
      
    return (
        <PopupWithForm onSubmit={handleSubmit} name="edit-avatar" title="Обновить аватар" buttonTitle="Сохранить" isOpen={isOpen} onClose={onClose}>
              <input ref={avatarRef} type="url" name="image-src" id="image-src"  className="popup__input popup__source" placeholder="Ссылка на картинку" required />
                  <span className="popup__error popup__error_is-active" id="image-src-error" />
                </PopupWithForm> 
    )
}

export default EditAvatarPopup;

