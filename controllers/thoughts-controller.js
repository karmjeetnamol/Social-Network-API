const {Thoughts, Users} = require('../models');
const thoughtsController = {

    // Create a new thought
    createThoughts(req, res) {
        Thoughts.create(req.body)
        .then(({_id}) => {
            return Users.findOneAndUpdate({ _id: req.params.userId}, 
            {$push: {thoughts: _id}}, 
            {new: true});
        })
        .then(dbThoughtsData => {
            if(!dbThoughtsData) {
                res.status(404).json({message: 'No thoughts with this  id!'});
                return;
            }
            res.json(dbThoughtsData)
        })
        .catch(err => res.json(err)); 
    },

    // Get all available Thoughts
    getAllThoughts(req,res) {
        Thoughts.find({})
        .populate({path: 'reactions', select: '-__v'})
        .select('-__v')
        .then(dbThoughtsData => res.json(dbThoughtsData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    // Get a certain thought by ID
    getThoughtsById(req, res) {
        Thoughts.findOne({ _id: req.params.id })
        .populate({path: 'reactions',select: '-__v'})
        .select('-__v')
        .then(dbThoughtsData => {
            if(!dbThoughtsData) {
            res.status(404).json({message: 'No thoughts with this  id!'});
            return;
        }
        res.json(dbThoughtsData)
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    // Update a current thought by ID
    updateThoughts(req, res) {
        Thoughts.findOneAndUpdate({_id: req.params.id}, 
            { $set: req.body }, 
            {new: true, runValidators: true})
        .populate({path: 'reactions', select: '-__v'})
        .select('-___v')
        .then(dbThoughtsData => {
            if (!dbThoughtsData) {
                res.status(404).json({message: 'No thoughts with this  id!'});
                return;
            }
                res.json(dbThoughtsData);
        })
        .catch(err => res.json(err));
    },

    // Delete a current thought by ID
    deleteThoughts(req, res) {
        Thoughts.findOneAndDelete({_id: req.params.id})
        .then(dbThoughtsData => {
            if (!dbThoughtsData) {
                res.status(404).json({message: 'No thoughts with this  id!'});
                return;
            }
            res.json(dbThoughtsData);
            })
            .catch(err => res.status(400).json(err));
    },

    // Add a new Reaction
    addReaction(req, res) {
        Thoughts.findOneAndUpdate(
            {_id: req.params.thoughtId}, 
            {$push: {reactions: req.body}}, 
            {new: true, runValidators: true})
        .populate({path: 'reactions', select: '-__v'})
        .select('-__v')
        .then(dbThoughtsData => {
        if (!dbThoughtsData) {
            res.status(404).json({message: 'No thoughts with this  id!'});
            return;
        }
        res.json(dbThoughtsData);
        })
        .catch(err => res.status(400).json(err))

    },

    // Delete a reaction by ID
    deleteReaction(req, res) {
        Thoughts.findOneAndUpdate(
            {_id: req.params.thoughtId}, 
            {$pull: {reactions: {reactionId: req.params.reactionId}}}, 
            {new : true})
        .then(dbThoughtsData => {
            if (!dbThoughtsData) {
                res.status(404).json({message: 'No thoughts with this  id!'});
                return;
            }
            res.json(dbThoughtsData);
        })
        .catch(err => res.status(400).json(err));
    }

};
module.exports = thoughtsController;