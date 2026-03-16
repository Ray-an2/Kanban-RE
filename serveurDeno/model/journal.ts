export interface Journal {
    jou_id: string;
    jou_titre: string;
    jou_description: string;
    jou_auteur: string;
    jou_action: string;
    jou_date: string;
    jou_etat: string;
    tab_id: string | null;
    car_id: string | null;
}
