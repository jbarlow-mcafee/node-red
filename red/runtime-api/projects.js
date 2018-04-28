/**
 * Copyright JS Foundation and other contributors, http://js.foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

/**
 * @namespace RED.projects
 */

var runtime;

var api = module.exports = {
    init: function(_runtime) {
        runtime = _runtime;
    },
    available: function(opts) {
        return Promise.resolve(!!runtime.storage.projects);
    },

    /**
    * List projects known to the runtime
    * @param {Object} opts
    * @param {User} opts.user - the user calling the api
    * @return {Promise<Object>} - resolves when complete
    * @memberof RED.projects
    */
    listProjects: function(opts) {
        return runtime.storage.projects.listProjects(opts.user).then(function(list) {
            var active = runtime.storage.projects.getActiveProject(opts.user);
            var response = {
                projects: list
            };
            if (active) {
                response.active = active.name;
            }
            return response;
        }).catch(function(err) {
            err.status = 400;
            throw err;
        })
    },

    /**
    * Create a new project
    * @param {Object} opts
    * @param {User} opts.user - the user calling the api
    * @param {Object} opts.project - the project information
    * @return {Promise<Object>} - resolves when complete
    * @memberof RED.projects
    */
    createProject: function(opts) {
        return runtime.storage.projects.createProject(opts.user, opts.project)
    },

    /**
    * Initialises an empty project
    * @param {Object} opts
    * @param {User} opts.user - the user calling the api
    * @param {String} opts.id - the id of the project to initialise
    * @param {Object} opts.project - the project information
    * @return {Promise<Object>} - resolves when complete
    * @memberof RED.projects
    */
    initialiseProject: function(opts) {
        // Initialised set when creating default files for an empty repo
        return runtime.storage.projects.initialiseProject(opts.user, opts.id, opts.project)
    },

    /**
    * Gets the active project
    * @param {Object} opts
    * @param {User} opts.user - the user calling the api
    * @return {Promise<Object>} - the active project
    * @memberof RED.projects
    */
    getActiveProject: function(opts) {
        return Promise.resolve(runtime.storage.projects.getActiveProject(opts.user));
    },

    /**
    *
    * @param {Object} opts
    * @param {User} opts.user - the user calling the api
    * @param {String} opts.id - the id of the project to activate
    * @return {Promise<Object>} - resolves when complete
    * @memberof RED.projects
    */
    setActiveProject: function(opts) {
        var currentProject = runtime.storage.projects.getActiveProject(opts.user);
        if (!currentProject || opts.id !== currentProject.name) {
            return runtime.storage.projects.setActiveProject(opts.user, opts.id);
        } else {
            return Promise.resolve();
        }
    },

    /**
    * Gets a projects metadata
    * @param {Object} opts
    * @param {User} opts.user - the user calling the api
    * @param {String} opts.id - the id of the project to get
    * @return {Promise<Object>} - the project metadata
    * @memberof RED.projects
    */
    getProject: function(opts) {
        return runtime.storage.projects.getProject(opts.user, opts.id)
    },

    /**
    * Updates the metadata of an existing project
    * @param {Object} opts
    * @param {User} opts.user - the user calling the api
    * @param {String} opts.id - the id of the project to update
    * @param {Object} opts.project - the project information
    * @return {Promise<Object>} - resolves when complete
    * @memberof RED.projects
    */
    updateProject: function(opts) {
        return runtime.storage.projects.updateProject(opts.user, opts.id, opts.project);
    },

    /**
    * Deletes a project
    * @param {Object} opts
    * @param {User} opts.user - the user calling the api
    * @param {String} opts.id - the id of the project to update
    * @return {Promise<Object>} - resolves when complete
    * @memberof RED.projects
    */
    deleteProject: function(opts) {
        return runtime.storage.projects.deleteProject(opts.user, opts.id);
    },

    /**
    * Gets current git status of a project
    * @param {Object} opts
    * @param {User} opts.user - the user calling the api
    * @param {String} opts.id - the id of the project
    * @param {Boolean} opts.remote - whether to include status of remote repos
    * @return {Promise<Object>} - the project status
    * @memberof RED.projects
    */
    getStatus: function(opts) {
        return runtime.storage.projects.getStatus(opts.user, opts.id, opts.remote)
    },

    /**
    * Get a list of local branches
    * @param {Object} opts
    * @param {User} opts.user - the user calling the api
    * @param {String} opts.id - the id of the project
    * @param {Boolean} opts.remote - whether to return remote branches (true) or local (false)
    * @return {Promise<Object>} - a list of the local branches
    * @memberof RED.projects
    */
    getBranches: function(opts) {
        return runtime.storage.projects.getBranches(opts.user, opts.id, opts.remote);
    },

    /**
    * Gets the status of a branch
    * @param {Object} opts
    * @param {User} opts.user - the user calling the api
    * @param {String} opts.id - the id of the project
    * @param {String} opts.branch - the name of the branch
    * @return {Promise<Object>} - the status of the branch
    * @memberof RED.projects
    */
    getBranchStatus: function(opts) {
        return runtime.storage.projects.getBranchStatus(opts.user, opts.id, opts.branch);
    },

    /**
    * Sets the current local branch
    * @param {Object} opts
    * @param {User} opts.user - the user calling the api
    * @param {String} opts.id - the id of the project
    * @param {String} opts.branch - the name of the branch
    * @param {Boolean} opts.create - whether to create the branch if it doesn't exist
    * @return {Promise<Object>} - resolves when complete
    * @memberof RED.projects
    */
    setBranch: function(opts) {
        return runtime.storage.projects.setBranch(opts.user, opts.id, opts.branch, opts.create)
    },

    /**
    * Deletes a branch
    * @param {Object} opts
    * @param {User} opts.user - the user calling the api
    * @param {String} opts.id - the id of the project
    * @param {String} opts.branch - the name of the branch
    * @param {Boolean} opts.force - whether to force delete
    * @return {Promise<Object>} - resolves when complete
    * @memberof RED.projects
    */
    deleteBranch: function(opts) {
        return runtime.storage.projects.deleteBranch(opts.user, opts.id, opts.branch, false, opts.force);
    },

    /**
    * Commits the current staged files
    * @param {Object} opts
    * @param {User} opts.user - the user calling the api
    * @param {String} opts.id - the id of the project
    * @param {String} opts.message - the message to associate with the commit
    * @return {Promise<Object>} - resolves when complete
    * @memberof RED.projects
    */
    commit: function(opts) {
        return runtime.storage.projects.commit(opts.user, opts.id,{message: opts.message});
    },

    /**
    * Gets the details of a single commit
    * @param {Object} opts
    * @param {User} opts.user - the user calling the api
    * @param {String} opts.id - the id of the project
    * @param {String} opts.sha - the sha of the commit to return
    * @return {Promise<Object>} - the commit details
    * @memberof RED.projects
    */
    getCommit: function(opts) {
        return runtime.storage.projects.getCommit(opts.user, opts.id, opts.sha);
    },

    /**
    * Gets the commit history of the project
    * @param {Object} opts
    * @param {User} opts.user - the user calling the api
    * @param {String} opts.id - the id of the project
    * @param {String} opts.limit - limit how many to return
    * @param {String} opts.before - id of the commit to work back from
    * @return {Promise<Array>} - an array of commits
    * @memberof RED.projects
    */
    getCommits: function(opts) {
        return runtime.storage.projects.getCommits(opts.user, opts.id, {
            limit: opts.limit || 20,
            before: opts.before
        });
    },

    /**
    * Abort an in-progress merge
    * @param {Object} opts
    * @param {User} opts.user - the user calling the api
    * @param {String} opts.id - the id of the project
    * @return {Promise<Object>} - resolves when complete
    * @memberof RED.projects
    */
    abortMerge: function(opts) {
        return runtime.storage.projects.abortMerge(opts.user, opts.id);
    },

    /**
    * Resolves a merge conflict
    * @param {Object} opts
    * @param {User} opts.user - the user calling the api
    * @param {String} opts.id - the id of the project
    * @param {String} opts.path - the path of the file being merged
    * @param {String} opts.resolutions - how to resolve the merge conflict
    * @return {Promise<Object>} - resolves when complete
    * @memberof RED.projects
    */
    resolveMerge: function(opts) {
        return runtime.storage.projects.resolveMerge(opts.user, opts.id, opts.path, opts.resolution);
    },

    /**
    * Gets a listing of the files in the project
    * @param {Object} opts
    * @param {User} opts.user - the user calling the api
    * @param {String} opts.id - the id of the project
    * @return {Promise<Object>} - the file listing
    * @memberof RED.projects
    */
    getFiles: function(opts) {
        return runtime.storage.projects.getFiles(opts.user, opts.id);
    },

    /**
    * Gets the contents of a file
    * @param {Object} opts
    * @param {User} opts.user - the user calling the api
    * @param {String} opts.id - the id of the project
    * @param {String} opts.path - the path of the file
    * @param {String} opts.tree - the version control tree to use
    * @return {Promise<String>} - the content of the file
    * @memberof RED.projects
    */
    getFile: function(opts) {
        return runtime.storage.projects.getFile(opts.user, opts.id,opts.path,opts.tree);
    },

    /**
    *
    * @param {Object} opts
    * @param {User} opts.user - the user calling the api
    * @param {String} opts.id - the id of the project
    * @param {String|Array} opts.path - the path of the file, or an array of paths
    * @return {Promise<Object>} - resolves when complete
    * @memberof RED.projects
    */
    stageFile: function(opts) {
        return runtime.storage.projects.stageFile(opts.user, opts.id, opts.path);
    },

    /**
    *
    * @param {Object} opts
    * @param {User} opts.user - the user calling the api
    * @param {String} opts.id - the id of the project
    * @param {String} opts.path - the path of the file. If not set, all staged files are unstaged
    * @return {Promise<Object>} - resolves when complete
    * @memberof RED.projects
    */
    unstageFile: function(opts) {
        return runtime.storage.projects.unstageFile(opts.user, opts.id, opts.path);
    },

    /**
    * Reverts changes to a file back to its commited version
    * @param {Object} opts
    * @param {User} opts.user - the user calling the api
    * @param {String} opts.id - the id of the project
    * @param {String} opts.path - the path of the file
    * @return {Promise<Object>} - resolves when complete
    * @memberof RED.projects
    */
    revertFile: function(opts) {
        return runtime.storage.projects.revertFile(opts.user, opts.id,opts.path)
    },

    /**
    * Get the diff of a file
    * @param {Object} opts
    * @param {User} opts.user - the user calling the api
    * @param {String} opts.id - the id of the project
    * @param {String} opts.path - the path of the file
    * @param {String} opts.type - the type of diff
    * @return {Promise<Object>} - the requested diff
    * @memberof RED.projects
    */
    getFileDiff: function(opts) {
        return runtime.storage.projects.getFileDiff(opts.user, opts.id, opts.path, opts.type);
    },

    /**
    * Gets a list of the project remotes
    * @param {Object} opts
    * @param {User} opts.user - the user calling the api
    * @param {String} opts.id - the id of the project
    * @return {Promise<Object>} - a list of project remotes
    * @memberof RED.projects
    */
    getRemotes: function(opts) {
        return runtime.storage.projects.getRemotes(opts.user, opts.id);

    },

    /**
    *
    * @param {Object} opts
    * @param {User} opts.user - the user calling the api
    * @param {String} opts.id - the id of the project
    * @param {Object} opts.remote - the remote metadata
    * @param {String} opts.remote.name - the name of the remote
    * @param {String} opts.remote.url - the url of the remote
    * @return {Promise<Object>} - resolves when complete
    * @memberof RED.projects
    */
    addRemote: function(opts) {
        return runtime.storage.projects.addRemote(opts.user, opts.id, opts.remote)
    },

    /**
    * Remove a project remote
    * @param {Object} opts
    * @param {User} opts.user - the user calling the api
    * @param {String} opts.id - the id of the project
    * @param {String} opts.remote - the name of the remote
    * @return {Promise<Object>} - resolves when complete
    * @memberof RED.projects
    */
    removeRemote: function(opts) {
        return runtime.storage.projects.removeRemote(opts.user, opts.id, opts.remote);
    },

    /**
    *
    * @param {Object} opts
    * @param {User} opts.user - the user calling the api
    * @param {String} opts.id - the id of the project
    * @param {Object} opts.remote - the remote metadata
    * @param {String} opts.remote.name - the name of the remote
    * @return {Promise<Object>} - resolves when complete
    * @memberof RED.projects
    */
    updateRemote: function(opts) {
        return runtime.storage.projects.updateRemote(opts.user, opts.id, opts.remote.name, opts.remote)
    },

    /**
    * Pull changes from the remote
    * @param {Object} opts
    * @param {User} opts.user - the user calling the api
    * @return {Promise<Object>} - resolves when complete
    * @memberof RED.projects
    */
    pull: function(opts) {
        return runtime.storage.projects.pull(opts.user, opts.id, opts.remote, opts.track, opts.allowUnrelatedHistories);
    },

    /**
    * Push changes to a remote
    * @param {Object} opts
    * @param {User} opts.user - the user calling the api
    * @param {String} opts.id - the id of the project
    * @param {String} opts.remote - the name of the remote
    * @param {String} opts.track - whether to set the remote as the upstream
    * @return {Promise<Object>} - resolves when complete
    * @memberof RED.projects
    */
    push: function(opts) {
        return runtime.storage.projects.push(opts.user, opts.id, opts.remote, opts.track);
    }

}
