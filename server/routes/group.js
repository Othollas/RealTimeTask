/**
 * Group API Service
 * 
 * Rôle global :
 *  - Fournir une route pour récupérer les informations d'un groupe et ses membres
 *  - Utiliser `verifyToken` pour sécuriser l'accès aux données
 *  - Interroger la base MongoDB via Mongoose pour récupérer les relations entre Users et Groups
 * 
 * Route principale :
 * 
 * 1. GET /
 *    - Vérifie que l'utilisateur est authentifié (via `verifyToken`)
 *    - Récupère l'utilisateur courant depuis la base MongoDB
 *    - Utilise `.populate("groups")` pour remplir les informations du groupe lié à cet utilisateur
 *    - Récupère tous les utilisateurs appartenant à ce groupe (`User.find({ groups: ... })`)
 *    - Renvoie un objet JSON contenant :
 *        - `titre_groupe` : nom du groupe de l'utilisateur courant
 *        - `nom_groupe` : liste des utilisateurs du même groupe
 * 
 * 2. POST / 
 *    - Vérifie que l'utilisateur est authentifié (via `verifyToken`)
 *    - Récupère l''id de l'user et le nom du nouveau groupe
 *    - Teste si le nom du groupe n'est pas deja utilisé
 *    - Sauvegarde un nouveau document dans la collection 
 *    - Modifie les informations de l'user
 *    - Renvoit un objet JSON contenant
 *        - `group_name : nom du groupe crée`
 *        - `validate : boolean qui defini si tout c'est bien passer afin de continuer l'execution dans le front`
 *        - `newGroup._id : id du groupe nouvellement crée afin de le stocker dans un state et recuperer les categories du groupe`
 * 
 * Sécurité et mémoire :
 *  - Route protégée via JWT et `verifyToken`
 *  - Population Mongoose permet d'éviter des requêtes manuelles multiples pour récupérer les infos de groupe
 * 
 * TODO / FIXME :
 *  - Limiter les champs retournés pour les utilisateurs afin de ne pas exposer toutes les données
 *  - Ajouter gestion d'erreurs plus précise et renvoyer des statuts HTTP appropriés
 *  - Gérer le cas où l'utilisateur n'appartient à aucun groupe
 * 
 * Usage typique :
 *  GET /groups → récupère le groupe et ses membres pour l'utilisateur connecté
 *  POST /groups → Ajoute un groupe et defini l'user comme admin
 */



import express from "express";
import verifyToken from "../function.js";
import User from "../schemas/userSchema.js";
import mongoose from "mongoose";
import Group from "../schemas/groupSchema.js";
import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/", verifyToken, async (req, res) => {

    try {
        // ici le populate prend en compte la clé groups dans le schema User et non le schema Group
        const infoGroup = await User.findById(req.user.id).populate("groups");

        if (infoGroup.groups) {
            // recuperation des users
            const usersGroup = await User.find({ groups: infoGroup.groups._id });

            // filtrage afin de ne pas se renvoyer soit meme.
            const otherUser = usersGroup.filter(user=> req.user.id != user._id);

            // resolution avec 
            res.json({ infoGroupe: infoGroup, user_in_group: otherUser });
        };

        // Ici je récupere toute les données des users, à termes, n'envoyer que les champs nécessaire

    } catch (error) {

        console.error(error)
    }
});



router.post("/", verifyToken, async (req, res) => {

    // recuperation de l'id de l'user et du nom du groupe
    const { nameGroup } = req.body;
    const idUser = req.user.id;

    try {
        // verifier si le nom n'existe pas et retouner une res si elle existe !
        const existingName = await Group.findOne({ group_name: nameGroup });

        if (existingName) {
            return res.status(400).json({ message: "le nom existe deja" })
        };

        // creation du nouveau groupe avec l'id et le name
        const newGroup = new Group({
            group_name: nameGroup,
            id_admin: idUser,
        });


        // save du group
        await newGroup.save();

        // mettre à jour l'user avec le nom du group
        const user = await User.findOne({ _id: idUser });
        user.is_admin = true;
        user.groups = newGroup._id;

        await user.save();

        return res.status(201).json({ group_name: nameGroup, validate: true, idGroup: newGroup._id })

    } catch (error) {
        console.error("merde il y a une erreur ", error)
    }
});


router.post("/member", verifyToken, async (req, res)=>{
    console.log(req.body.nameMember);

    const query = await User.findOne({ username : req.body.nameMember})

    if(query){
        console.log(query.groups)
    }
   

    res.json({result : query})

});


router.delete("/:id", verifyToken, async (req, res) => {
    console.log(req.params.id);

    try {

        // recuperation de l'id du groupe 



        // recherche du groupe avec l'id, population avec l'user ?
        const valid = await Group.findById(req.params.id).populate('id_admin');

        // const deleted_group = await Group.findOne({ _id: ObjectId(req.params.id)})



        if (!valid) throw new Error("erreur dans la suppression duu groupe");

        // suppression du groupe 

        if (valid.id_admin.is_admin === true && valid.id_admin._id == req.user.id) {
            // je supprime le document du groupe
            const deleted_group = await Group.findByIdAndDelete(req.params.id)

            console.log(deleted_group);
            // je supprime les informations dans mon user 
            const user = await User.findById(req.user.id);

            user.is_admin = false;

            user.set('groups', undefined); // ou null
            user.markModified('groups');


            console.log(user)
            await user.save()

            // et je renvois un json contenant des info pou faire un fetch !! 
            return res.status(201).json({ status: "deleted", valid: true, el_deleted: deleted_group });
        }

        // modification des informations de luser pour supprimer le groupe et pour enlever is_admin 



    } catch (error) {
        console.error("il y a une couille dans le potage ", error)
    }
});


router.put("/:id", verifyToken, async (req, res) => {
    // recuperation de l'id du groupe
    // recup des données à modifier (nom du groupe, ip_admin si il doit changer etc...)

    try {
        // faire un appel collection et recuperer le document,  le stocker dans une variable 

        // modifer les valeurs du document 

        // conditionnel pour filtrer (ancien user, nouveau user etc... )

        // sauvegarder les changements !! 

        // modifier le ou les users 



    } catch (error) {
        console.error("et merde !!!! ", error)
    }


});

export default router;