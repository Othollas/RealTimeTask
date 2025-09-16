import { useEffect, useState } from 'react'
import { Toast, ToastContainer } from 'react-bootstrap'
import { toastService } from '../service/toastService';

const GlobalToast = () => {
    // Définition du state local pour sotcker les toasts à afficher 
    const [toasts, setToasts] = useState([]);

    // J'utilise un useEffect pour m'abonner au service toast
    useEffect(() => {
        // Fonction gerant les nouveaux toasts
        const handleNewToast = (toast) => {
            // Ajout du toast à la liste (prev permet de prendre le dernier etat mis à jour)
            setToasts(prev => [...prev, toast]);

            // setTimeout afin de faire disparaitre le toast automatiquement
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== toast.id))
            }, 3000)
        }

        // Abonnement au service toast
        const unsubscribe = toastService.subscribe(handleNewToast); // toastService.subscribe retourne une fonction de désabonnement

        // CleanUp : desabonnement quand le composant est demonté 
        return unsubscribe;
    }, []); // tableau vide == s'execute qu'une seule fois au mount 

    return (
        // Conteneur bootstrap pour les toats
        <ToastContainer position='top-end' className='p-3'>
            {/* Mapping de tous les toasts vers des composants Toast */}
            {toasts.map(toast => (
                <Toast
                    key={toast.id} // Clé unique pour react
                    show={true} // Toujours visible (hors timeout)
                    bg={toast.type} // Couleur de fond selon le type
                    onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} // CallBack quand l'utilisateur clique sur la croix, efface le toast du tableau de
                >
                    {/* 17. En-tête du toast */}
                    <Toast.Header>
                        <strong className="me-auto">
                            {/* 18. Emoji selon le type de toast */}
                            {toast.type === 'success' && '✅ '}
                            {toast.type === 'danger' && '❌ '}
                            {toast.type === 'warning' && '⚠️ '}
                            Notification
                        </strong>
                    </Toast.Header>
                    <Toast.Body className={toast.type !== 'light' ? 'text-white' : ''}>
                        {toast.message}
                    </Toast.Body>
                </Toast>
            ))}
        </ToastContainer>
    );
};

export default GlobalToast;




