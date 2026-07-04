import AppError from "../utils/app-error.js";
import createSupabaseClient from "../utils/create-supabase-client.js";

export async function addKid(req, res, next) {
    const full_name = req.body.full_name;
    const user_id = req.body.user_id ?? req.user.id;
    const classroom = req.body.classroom;
    const is_confirmed = req.user.role === 'admin';

    const client = await createSupabaseClient();

    const { error } = await client.from('kids').insert({
        full_name,
        user_id,
        classroom,
        is_confirmed
    });

    if (error) {
        throw new AppError("Could not add kid", 500, error);
    }

    return res.sendStatus(200);
}

export async function getKidsOf(req, res, next) {
    const client = await createSupabaseClient();
    const user_id = req.params.id;

    const { data, error } = await client.from("kids").select("*").eq("user_id", user_id);

    if (error) {
        throw new AppError("Could not getting kids", 500, error);
    }

    res.send(data);
}

export async function getAllKids(req, res, next) {
    if (req.user.role !== 'admin') {
        throw new AppError("You are not allowed to access this resource", 403);
    }

    const client = await createSupabaseClient();

    const { data, error } = await client.from("kids").select("*");

    if (error) {
        throw new AppError("Could not getting all kids", 500, error);
    }

    res.send(data);
}

export async function callKid(req, res, next) {
    const user_id = req.user.id;
    const kid_id = req.params.id;

    const client = await createSupabaseClient();

    // kid id must be an integer
    const parsedKidId = parseInt(kid_id, 10);
    if (isNaN(parsedKidId)) {
        throw new AppError("Invalid id type. Expected: 'int'", 400);
    }

    // First we need to check if the kid exists 
    const { data, error } = await client.from("kids").select("*").eq("id", parsedKidId).single();

    if (error) {
        throw new AppError("Could not find the kid", 404, error);
    }

    // And he has to be confirmed too
    if (!data.is_confirmed) {
        throw new AppError("The kid is not confirmed", 400);
    }

    // Ownership Check so not any authenticated user can call any confirmed kid
    if (data.user_id !== req.user.id && req.user.role !== 'admin') {
        throw new AppError("You are not allowed to call this kid", 403);
    }

    // Then add the call to the public.calls
    await createCall(client, user_id, parsedKidId);

    // and add public.call_logs
    await recordCallHistory(client, user_id, parsedKidId);

    return res.status(200).send("The kid was called successfully");
}


export async function confirmKid(req, res, next) {
    const kid_id = req.params.id;

    if (req.user.role !== 'admin') {
        throw new AppError("You are not allowed to provide confirmation", 403);
    }

    const client = await createSupabaseClient();

    const { error } = await client.from('kids').update({
        is_confirmed: true
    }).eq("id", kid_id);

    if (error) {
        throw new AppError("Could not confirm kid", 500, error);
    }

    return res.status(200).send("The kid was confirmed successfully");
}

// for creating a call in public.calls
async function createCall(client, user_id, kid_id) {
    const { error } = await client.from('calls').insert({
        user_id,
        kid_id
    });

    if (error) {
        throw new AppError("Could not call the kid", 500, error);
    }
}

// for recording call history
async function recordCallHistory(client, user_id, kid_id) {
    const { error } = await client.from('call_logs').insert({
        user_id,
        kid_id
    });
    if (error) {
        throw new AppError("Could not log the call", 500, error);
    }
}