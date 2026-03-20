package com.kanban.journal.helper;

public final class JournalAction {

    private JournalAction() {}

    // Tableau
    public static final String CREATE_BOARD   = "Création";
    public static final String UPDATE_BOARD   = "Modification";
    public static final String DELETE_BOARD   = "Suppression";
    public static final String CLOSE_BOARD    = "Changement Etat";
    public static final String OPEN_BOARD     = "Changement Etat";

    // Liste
    public static final String CREATE_LIST    = "Création";
    public static final String UPDATE_LIST    = "Modification";
    public static final String DELETE_LIST    = "Suppression";
    public static final String ARCHIVE_LIST   = "Changement Etat";
    public static final String UNARCHIVE_LIST = "Changement Etat";
    public static final String REORDER_LIST   = "Déplacement";

    // Carte
    public static final String CREATE_CARD    = "Création";
    public static final String UPDATE_CARD    = "Modification";
    public static final String DELETE_CARD    = "Suppression";
    public static final String ARCHIVE_CARD   = "Changement Etat";
    public static final String COMPLETE_CARD  = "Changement Etat";
    public static final String MOVE_CARD      = "Déplacement";

    // Membres
    public static final String ADD_MEMBER     = "Ajout membre";
    public static final String REMOVE_MEMBER  = "Suppression membre";

    //  Étiquettes
    public static final String ADD_LABEL      = "Ajout etiquette";
    public static final String REMOVE_LABEL   = "Suppression etiquette";
}