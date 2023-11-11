const req = require("express/lib/request");
const res = require("express/lib/response");
const { BadRequestError } = require("../errors");
const handlePromise = require("../helpers/promise.helper");
const Contact = require("../models/contact.model");

//Create and save a new Contact
exports.create = async (req, res, next) => {
    // Validate request
    if(!req.body.name) {
        return next(new BadRequestError(400, 'Name can not to be empty'));
    }

    // Create a Contact
    const contact = new Contact({
        name: req.body.name,
        email: req.body.email,
        address: req.body.address,
        phone: req.body.phone,
        favorite: String(req.body.favorite).toLowerCase() === 'true',
    });

    //Save contact in the database
    const [error, document] = await handlePromise(contact.save());

    if(error) {
        return next(new BadRequestError(500, 'An error occurred while create the contact'));
    }

    return res.send(document);
};

//Retrieve all contacts of a user from the database
exports.findAll = async (req, res, next) => {
    const condition = {  };
    const name = req.query.name;
    if(name) {
        condition.name = { $regex: new RegExp(name), $option: "i" };
    }

    const [error, documents] = await handlePromise(Contact.find(condition));

    if(error) {
        return next(new BadRequestError(500, 'An error occurred while create the contact'));
    }
    
    return res.send(documents);
};

// Find a single contact with a id
exports.findOne = async (req, res, next) => {
    const condition = { _id: req.params.id };

    const [error, document] = await handlePromise(Contact.findOne(condition));

    if(error) {
        return next(new BadRequestError(500, `Error retrieving contact with id=${req.params.id}`));
    }

    if(!document) {
        return next(new BadRequestError(404, 'Contact not found'));
    }

    return res.send(document);
};

// Update the contact by the id in the request
exports.update = async (req, res, next) => {
    if(!req.body) {
        return next(new BadRequestError(400, 'Data to update can not to empty'));
    }

    const condition = { _id: req.params.id };

    const [error, document] = await handlePromise(
        Contact.findOneAndUpdate(condition, req.body, {
            new: true,
        })
    );

    if(error) {
        return next(new BadRequestError(500, `Error updating contact with id=${req.params.id}`));
    }

    if(!document) {
        return next(new BadRequestError(404, 'Contact not found'));
    }

    return res.send({message: "Contact was update successfully"});

};

// Delete a contact with the specified id in the request
exports.delete = async (req, res, next) => {
    const condition = { _id: req.params.id };

    const [error, document] = await handlePromise(Contact.findOneAndDelete(condition));

    if(error) {
        return next(new BadRequestError(500, `Could not delete contact with id=${req.params.id}`));
    }

    if(!document) {
        return next(new BadRequestError(404, 'Contact not found'));
    }

    return res.send({message: "Contact was deleted successfully"});

};

// Delete all contacts of a user from the database
exports.deleteAll = async (req,res) => {
    const [error, data] = await handlePromise( Contact.deleteMany({  }) );

    if(error) {
        return next(new BadRequestError(500, 'An error occurred while remove all contacts'));
    }

    return res.send({
        message: `${data.deletedCount} contacts were deleted successfully`,
    });
};

// Find all favorite contacts of a user
exports.findAllFavorite = async (req, res) => {    
    const [error, documents] = await handlePromise(Contact.find({ favorite: true }));

    if(error) {
        return next(new BadRequestError(500, 'An error occurred while retrieving favorite contacts'));
    }

    return res.send(documents);
};